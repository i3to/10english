'use strict';

(function(){
  const cfg=window.ENGLISH350_CONFIG||{};
  const client=window.supabase?.createClient?.(cfg.supabaseUrl,cfg.supabasePublishableKey,{
    auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}
  });
  let user=null, ready=false, applyingRemote=false, saveTimer=null;
  const $=id=>document.getElementById(id);
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function setSync(text,state=''){
    const el=$('sync-status'); if(!el)return;
    el.textContent=text; el.dataset.state=state;
  }
  function authMessage(text,type=''){
    const el=$('auth-message'); if(!el)return;
    el.textContent=text||''; el.className='auth-message '+type;
  }
  function showAuth(show=true){$('auth-screen')?.classList.toggle('hide',!show);}
  function setAuthMode(mode){
    document.querySelectorAll('[data-auth-mode]').forEach(b=>b.classList.toggle('on',b.dataset.authMode===mode));
    $('auth-name')?.classList.toggle('hide',mode!=='signup');
    $('auth-password')?.classList.toggle('hide',mode==='magic');
    const submit=$('auth-submit');
    if(submit)submit.textContent=mode==='signup'?'إنشاء الحساب':mode==='magic'?'إرسال رابط الدخول':'دخول';
    $('auth-form').dataset.mode=mode;authMessage('');
  }
  async function submitAuth(e){
    e.preventDefault();
    const mode=$('auth-form').dataset.mode||'login';
    const email=$('auth-email').value.trim();
    const password=$('auth-password').value;
    const name=$('auth-name').value.trim();
    if(!email)return authMessage('أدخل البريد الإلكتروني','error');
    const btn=$('auth-submit');btn.disabled=true;authMessage('جارٍ المتابعة...');
    try{
      let result;
      if(mode==='signup'){
        if(password.length<6)throw new Error('كلمة المرور يجب ألا تقل عن 6 أحرف.');
        result=await client.auth.signUp({email,password,options:{data:{display_name:name||email.split('@')[0]}}});
        if(result.error)throw result.error;
        authMessage(result.data.session?'تم إنشاء الحساب.':'تم إنشاء الحساب. افتح رسالة التأكيد في بريدك ثم سجّل الدخول.','success');
      }else if(mode==='magic'){
        result=await client.auth.signInWithOtp({email,options:{emailRedirectTo:location.origin+location.pathname}});
        if(result.error)throw result.error;
        authMessage('أرسلنا رابط الدخول إلى بريدك.','success');
      }else{
        if(!password)throw new Error('أدخل كلمة المرور.');
        result=await client.auth.signInWithPassword({email,password});
        if(result.error)throw result.error;
      }
    }catch(err){authMessage(err.message||'تعذر تسجيل الدخول.','error')}
    finally{btn.disabled=false}
  }
  async function loadRemoteState(){
    if(!user)return;
    setSync('جارٍ المزامنة','syncing');
    const {data,error}=await client.from('user_progress').select('app_state,updated_at').eq('user_id',user.id).maybeSingle();
    if(error){setSync('تعذر التحميل','error');return}
    const local=window.English350App?.getState?.()||{};
    const remote=data?.app_state||{};
    const hasRemote=remote&&Object.keys(remote).length>0;
    const hasLocal=local&&(local.xp>0||Object.keys(local.cards||{}).length>0||local.phrases?.length);
    applyingRemote=true;
    if(hasRemote){window.English350App?.replaceState?.(remote)}
    else if(hasLocal){await saveNow(local)}
    applyingRemote=false;
    setSync('تمت المزامنة','ok');
  }
  function summary(state){
    const cards=Object.values(state.cards||{});
    let total=0,correct=0,learned=0;
    cards.forEach(c=>{total+=Number(c?.n||c?.attempts||0);correct+=Number(c?.c||c?.correct||0);if((c?.lv||c?.level||0)>=2)learned++});
    return {completed_items:Object.keys(state.cards||{}).length,learned_items:learned,total_attempts:total,correct_attempts:correct,current_streak:Number(state.streak||0),last_activity_at:new Date().toISOString()};
  }
  async function saveNow(state){
    if(!client||!user||applyingRemote)return;
    setSync(navigator.onLine?'جارٍ الحفظ':'بانتظار الاتصال',navigator.onLine?'syncing':'offline');
    if(!navigator.onLine)return;
    const row={user_id:user.id,app_state:state,...summary(state)};
    const {error}=await client.from('user_progress').upsert(row,{onConflict:'user_id'});
    if(error){console.error(error);setSync('لم يتم الحفظ','error')}else setSync('تم الحفظ','ok');
  }
  function scheduleSave(state){
    if(!ready||!user||applyingRemote)return;
    clearTimeout(saveTimer);saveTimer=setTimeout(()=>saveNow(state),650);
  }
  async function logout(){await client.auth.signOut();}
  function accountHTML(){
    if(!user)return '';
    return `<div class="account-mini"><div class="account-avatar">${esc((user.user_metadata?.display_name||user.email||'U').trim()[0]?.toUpperCase())}</div><div class="account-copy"><b>${esc(user.user_metadata?.display_name||'حسابي')}</b><span>${esc(user.email||'')}</span></div><button class="b gh account-logout" onclick="English350Cloud.logout()">خروج</button></div>`;
  }
  async function createTeam(){
    const name=prompt('اسم المجموعة','مجموعة English 350'); if(!name?.trim())return;
    const {error}=await client.from('teams').insert({name:name.trim(),owner_id:user.id});
    if(error)alert(error.message);else renderTeamPanel();
  }
  async function joinTeam(){
    const code=prompt('أدخل رمز المجموعة');if(!code?.trim())return;
    const {error}=await client.rpc('join_team_by_code',{p_code:code.trim().toUpperCase()});
    if(error)alert(error.message);else renderTeamPanel();
  }
  async function renderTeamPanel(){
    const el=$('team-panel');if(!el||!user)return;
    el.innerHTML='<div class="sub">جارٍ تحميل المجموعة...</div>';
    const {data:memberships,error}=await client.from('team_members').select('team_id,role').eq('user_id',user.id);
    if(error){el.innerHTML='<div class="sub">تعذر تحميل المجموعة.</div>';return}
    if(!memberships?.length){
      el.innerHTML='<div class="team-empty"><div class="sub">أنشئ مجموعة أو انضم برمز يرسله لك زميلك.</div><div class="team-actions"><button class="b g" onclick="English350Cloud.createTeam()">إنشاء مجموعة</button><button class="b gh" onclick="English350Cloud.joinTeam()">الانضمام برمز</button></div></div>';return;
    }
    const m=memberships[0];
    const {data:team}=await client.from('teams').select('id,name,join_code').eq('id',m.team_id).single();
    let html=`<div class="team-head"><div><b>${esc(team?.name||'المجموعة')}</b><div class="sub">رمز الانضمام: <strong class="team-code">${esc(team?.join_code||'—')}</strong></div></div></div>`;
    const {data:rows,error:membersError}=await client.from('team_members').select('user_id,role,joined_at').eq('team_id',m.team_id);
    if(membersError){el.innerHTML=html+'<div class="sub" style="margin-top:12px">تعذر تحميل أعضاء المجموعة.</div>';return}
    const ids=(rows||[]).map(x=>x.user_id);
    if(!ids.length){el.innerHTML=html+'<div class="sub" style="margin-top:12px">لا يوجد أعضاء بعد.</div>';return}
    const [{data:profiles,error:profilesError},{data:progress,error:progressError}]=await Promise.all([
      client.from('profiles').select('id,display_name').in('id',ids),
      client.from('user_progress').select('user_id,app_state,completed_items,learned_items,total_attempts,correct_attempts,current_streak,last_activity_at').in('user_id',ids)
    ]);
    if(profilesError||progressError){el.innerHTML=html+'<div class="sub" style="margin-top:12px">تعذر تحميل لوحة الصدارة.</div>';return}
    const pm=Object.fromEntries((profiles||[]).map(x=>[x.id,x]));
    const gm=Object.fromEntries((progress||[]).map(x=>[x.user_id,x]));
    const ranked=(rows||[]).map(r=>{
      const p=pm[r.user_id]||{},g=gm[r.user_id]||{};
      const xp=Math.max(0,Number(g.app_state?.xp||0));
      const acc=g.total_attempts?Math.round(Number(g.correct_attempts||0)/Number(g.total_attempts)*100):0;
      return {...r,name:p.display_name||'مستخدم',xp,acc,completed:Number(g.completed_items||0),streak:Number(g.current_streak||0)};
    }).sort((a,b)=>b.xp-a.xp||b.completed-a.completed||b.acc-a.acc||new Date(a.joined_at)-new Date(b.joined_at));
    const medals=['🥇','🥈','🥉'];
    html+='<div class="leaderboard-note sub">الترتيب حسب نقاط XP الإجمالية</div>';
    html+='<div class="team-list leaderboard-list">'+ranked.map((r,i)=>`<div class="team-user leaderboard-user ${r.user_id===user.id?'is-me':''}"><div class="leader-rank">${medals[i]||`<span>${i+1}</span>`}</div><div class="leader-person"><b>${esc(r.name)}${r.user_id===user.id?' <small>أنت</small>':''}</b><span>${r.role==='owner'?'المالك':r.role==='admin'?'مدير':'عضو'}</span></div><div class="leader-score"><strong>${r.xp.toLocaleString('ar-SA')} XP</strong><div class="team-metrics"><span>${r.completed} منجز</span><span>${r.acc}% دقة</span><span>${r.streak} أيام</span></div></div></div>`).join('')+'</div>';
    el.innerHTML=html;
  }
  async function init(){
    if(!client){authMessage('تعذر تهيئة الاتصال.','error');showAuth(true);return}
    $('auth-form')?.addEventListener('submit',submitAuth);
    document.querySelectorAll('[data-auth-mode]').forEach(b=>b.onclick=()=>setAuthMode(b.dataset.authMode));
    const {data}=await client.auth.getSession();user=data.session?.user||null;
    client.auth.onAuthStateChange(async(_event,session)=>{
      user=session?.user||null;showAuth(!user);
      if(user){ready=true;await loadRemoteState();window.English350App?.render?.()}else{ready=false;setSync('غير متصل','')}
    });
    showAuth(!user);
    if(user){ready=true;await loadRemoteState();window.English350App?.render?.()}
    window.addEventListener('online',()=>{setSync('جارٍ الاستئناف','syncing');scheduleSave(window.English350App?.getState?.())});
  }
  window.English350Cloud={init,scheduleSave,saveNow,logout,accountHTML,renderTeamPanel,createTeam,joinTeam,getUser:()=>user};
  document.addEventListener('DOMContentLoaded',init);
})();
