'use strict';

(function(){
  const cfg=window.ENGLISH350_CONFIG||{};
  const client=window.supabase?.createClient?.(cfg.supabaseUrl,cfg.supabasePublishableKey,{
    auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,flowType:'implicit'}
  });
  let user=null, ready=false, applyingRemote=false, saveTimer=null, sessionApplied=false;
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
        result=await client.auth.signUp({email,password,options:{emailRedirectTo:location.origin+location.pathname,data:{display_name:name||email.split('@')[0]}}});
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
  let leagueChannel=null,leagueRenderTimer=null;
  function leagueModal({title,body,confirmText='متابعة',onConfirm}){
    document.getElementById('cloud-modal')?.remove();
    const wrap=document.createElement('div');wrap.id='cloud-modal';wrap.className='cloud-modal';
    wrap.innerHTML=`<div class="cloud-modal-card"><h2>${esc(title)}</h2>${body}<div id="cloud-modal-message" class="auth-message"></div><div class="cloud-modal-actions"><button class="b gh" type="button" data-close>إلغاء</button><button class="b g" type="button" data-confirm>${esc(confirmText)}</button></div></div>`;
    document.body.appendChild(wrap);
    const close=()=>wrap.remove();wrap.querySelector('[data-close]').onclick=close;
    wrap.onclick=e=>{if(e.target===wrap)close()};
    wrap.querySelector('[data-confirm]').onclick=async()=>{
      const btn=wrap.querySelector('[data-confirm]'),msg=wrap.querySelector('#cloud-modal-message');btn.disabled=true;msg.textContent='جارٍ المتابعة...';
      try{await onConfirm(wrap);close()}catch(err){msg.textContent=err.message||'تعذر إكمال العملية.';msg.className='auth-message error';btn.disabled=false}
    };
    setTimeout(()=>wrap.querySelector('input')?.focus(),30);
  }
  async function createTeam(){
    if(!user)return;
    leagueModal({title:'إنشاء دوري',confirmText:'إنشاء الدوري',body:'<div class="sub" style="margin-bottom:10px">اختر اسمًا يظهر لجميع الأعضاء.</div><input id="league-name" maxlength="50" placeholder="مثال: أبطال English 350" value="دوري English 350">',onConfirm:async modal=>{
      const name=modal.querySelector('#league-name').value.trim();if(!name)throw new Error('اكتب اسم الدوري.');
      const {error}=await client.from('teams').insert({name,owner_id:user.id});if(error)throw error;
      await renderTeamPanel();
    }});
  }
  async function joinTeam(){
    if(!user)return;
    leagueModal({title:'الانضمام إلى دوري',confirmText:'انضمام',body:'<div class="sub" style="margin-bottom:10px">أدخل رمز الدعوة المكوّن من أحرف وأرقام.</div><input id="league-code-input" maxlength="12" inputmode="text" dir="ltr" style="text-transform:uppercase;text-align:center;letter-spacing:3px" placeholder="AB12CD">',onConfirm:async modal=>{
      const code=modal.querySelector('#league-code-input').value.trim().toUpperCase();if(!code)throw new Error('أدخل رمز الدوري.');
      const {error}=await client.rpc('join_team_by_code',{p_code:code});if(error)throw error;
      await renderTeamPanel();
    }});
  }
  async function copyLeagueCode(code){
    try{await navigator.clipboard.writeText(code);alert('تم نسخ رمز الدعوة.')}catch(_){prompt('انسخ رمز الدعوة',code)}
  }
  async function shareLeague(name,code){
    const text=`انضم إلى دوري ${name} في English 350\nرمز الدعوة: ${code}`;
    if(navigator.share){try{await navigator.share({title:`دوري ${name}`,text});return}catch(e){if(e.name==='AbortError')return}}
    await copyLeagueCode(code);
  }
  function roleLabel(role){return role==='owner'?'المالك':role==='admin'?'مدير':'عضو'}
  function scheduleLeagueRender(){clearTimeout(leagueRenderTimer);leagueRenderTimer=setTimeout(()=>{const panel=$('team-panel');if(panel&&!panel.closest('.view')?.classList.contains('hide'))renderTeamPanel()},900)}
  function subscribeLeague(teamId){
    if(leagueChannel){client.removeChannel(leagueChannel);leagueChannel=null}
    leagueChannel=client.channel(`league-${teamId}`)
      .on('postgres_changes',{event:'*',schema:'public',table:'team_members',filter:`team_id=eq.${teamId}`},scheduleLeagueRender)
      .on('postgres_changes',{event:'*',schema:'public',table:'user_progress'},scheduleLeagueRender)
      .subscribe();
  }
  async function renderTeamPanel(){
    const el=$('team-panel');if(!el||!user)return;
    el.innerHTML='<div class="c league-status">جارٍ تحميل الدوري...</div>';
    const {data:memberships,error}=await client.from('team_members').select('team_id,role').eq('user_id',user.id).limit(1);
    if(error){el.innerHTML=`<div class="c league-status">تعذر تحميل الدوري.<div class="sub">${esc(error.message)}</div></div>`;return}
    if(!memberships?.length){
      if(leagueChannel){client.removeChannel(leagueChannel);leagueChannel=null}
      el.innerHTML='<div class="c league-empty"><div class="big">🏆</div><h2>ابدأ المنافسة</h2><div class="sub">أنشئ دوريًا خاصًا أو انضم إلى زملائك برمز الدعوة.</div><div class="league-actions"><button class="b g" onclick="English350Cloud.createTeam()">إنشاء دوري</button><button class="b gh" onclick="English350Cloud.joinTeam()">الانضمام برمز</button></div></div>';return;
    }
    const m=memberships[0];
    const {data:team,error:teamError}=await client.from('teams').select('id,name,join_code').eq('id',m.team_id).single();
    if(teamError){el.innerHTML='<div class="c league-status">تعذر قراءة بيانات الدوري.</div>';return}
    const {data:rows,error:rowsError}=await client.from('team_members').select('user_id,role,joined_at').eq('team_id',m.team_id);
    if(rowsError){el.innerHTML='<div class="c league-status">تعذر تحميل أعضاء الدوري.</div>';return}
    const ids=(rows||[]).map(x=>x.user_id);
    let profiles=[],progress=[];
    if(ids.length){
      const result=await Promise.all([
        client.from('profiles').select('id,display_name').in('id',ids),
        client.from('user_progress').select('user_id,app_state,completed_items,learned_items,total_attempts,correct_attempts,current_streak,last_activity_at').in('user_id',ids)
      ]);
      if(result[0].error||result[1].error){el.innerHTML='<div class="c league-status">لا تملك صلاحية مشاهدة ترتيب الدوري. راجع سياسات RLS.</div>';return}
      profiles=result[0].data||[];progress=result[1].data||[];
    }
    const pm=Object.fromEntries(profiles.map(x=>[x.id,x])),gm=Object.fromEntries(progress.map(x=>[x.user_id,x]));
    const ranked=(rows||[]).map(r=>{
      const p=pm[r.user_id]||{},g=gm[r.user_id]||{},state=g.app_state||{};
      const xp=Number(state.xp||0),streak=Number(g.current_streak||state.streak||0),learned=Number(g.learned_items||0),completed=Number(g.completed_items||0);
      const production=Object.keys(state.production||{}).length,scenarios=Object.keys(state.scenarios||{}).length;
      const score=xp+(streak*10)+(learned*5)+(production*2)+(scenarios*10);
      const accuracy=g.total_attempts?Math.round(Number(g.correct_attempts||0)/Number(g.total_attempts)*100):0;
      return {...r,name:p.display_name||'مستخدم',xp,streak,learned,completed,score,accuracy};
    }).sort((a,b)=>b.score-a.score||b.xp-a.xp||a.joined_at?.localeCompare?.(b.joined_at||'')||0);
    const myRank=ranked.findIndex(x=>x.user_id===user.id)+1;
    const list=ranked.map((r,i)=>`<div class="league-user ${r.user_id===user.id?'me':''}"><div class="league-rank">${i<3?['🥇','🥈','🥉'][i]:i+1}</div><div class="league-person"><b>${esc(r.name)}${r.user_id===user.id?' · أنت':''}</b><small>${roleLabel(r.role)}</small><div class="league-meta"><span>⚡ ${r.xp} XP</span><span>🔥 ${r.streak}</span><span>📚 ${r.learned}/350</span><span>✓ ${r.accuracy}%</span></div></div><div class="league-score"><b>${r.score}</b><small>نقطة دوري</small></div></div>`).join('');
    el.innerHTML=`<div class="c league-hero"><div class="league-title"><div class="league-icon">🏆</div><div><div class="sub">الدوري الحالي</div><h2 style="margin:2px 0">${esc(team.name||'دوري English 350')}</h2><div class="sub">مركزك الآن: ${myRank?`#${myRank}`:'—'} من ${ranked.length}</div></div></div><div class="league-code-box"><div><div class="sub">رمز الدعوة</div><strong class="league-code">${esc(team.join_code||'—')}</strong></div><button class="b gh" onclick="English350Cloud.copyLeagueCode('${esc(team.join_code||'')}')">نسخ</button></div><div class="league-actions"><button class="b g" onclick="English350Cloud.shareLeague('${esc(team.name||'الدوري')}','${esc(team.join_code||'')}')">مشاركة الدعوة</button><button class="b gh" onclick="English350Cloud.renderTeamPanel()">تحديث</button></div></div><div class="c"><h2 style="margin-bottom:4px">لوحة الترتيب</h2><div class="sub" style="margin-bottom:12px">الترتيب يجمع XP والاستمرارية والتقدم الحقيقي.</div><div class="league-list">${list||'<div class="league-status">لا يوجد أعضاء بعد.</div>'}</div></div>`;
    subscribeLeague(m.team_id);
  }
  function goHomeImmediately(){
    const app=window.English350App;
    if(typeof app?.showHome==='function'){
      app.showHome();
      return;
    }
    document.querySelector('.nv[data-v="home"]')?.click();
  }
  async function applySession(session,{force=false,navigateHome=false}={}){
    const nextUser=session?.user||null;
    const sameUser=Boolean(user&&nextUser&&user.id===nextUser.id);
    user=nextUser;

    // انقل الواجهة للرئيسية قبل إخفاء شاشة الدخول، حتى لا تظهر صفحة المزيد ولو للحظة.
    if(user&&(navigateHome||!sessionApplied)){
      goHomeImmediately();
    }
    showAuth(!user);

    if(user){
      ready=true;
      // وجّه للرئيسية فورًا قبل انتظار تحميل بيانات السحابة،
      // حتى لا تظهر صفحة «المزيد» لثوانٍ ثم تنتقل للرئيسية.
      if(navigateHome){
        goHomeImmediately();
      }
      // لا نعيد تحميل التقدم أو إعادة رسم التطبيق عند تجدد التوكن
      // أو عند الرجوع للتبويب؛ المزامنة الكاملة تحدث مرة واحدة فقط لكل جلسة.
      if(force||!sessionApplied||!sameUser){
        sessionApplied=true;
        await loadRemoteState();
      }
      if(!navigateHome){
        window.English350App?.render?.();
      }
      if(location.hash||new URLSearchParams(location.search).has('code')){
        history.replaceState({},document.title,location.pathname);
      }
    }else{
      sessionApplied=false;
      ready=false;
      setSync('غير متصل','');
    }
  }
  async function init(){
    if(!client){authMessage('تعذر تهيئة الاتصال.','error');showAuth(true);return}
    $('auth-form')?.addEventListener('submit',submitAuth);
    document.querySelectorAll('[data-auth-mode]').forEach(b=>b.onclick=()=>setAuthMode(b.dataset.authMode));

    client.auth.onAuthStateChange((event,session)=>{
      setTimeout(()=>{
        if(event==='TOKEN_REFRESHED'){
          // تحديث بيانات الجلسة فقط بدون ريفريش الواجهة أو رسالة مزامنة.
          user=session?.user||user;
          return;
        }
        if(event==='USER_UPDATED'){
          user=session?.user||user;
          return;
        }
        if(event==='SIGNED_OUT'){
          applySession(null);
          return;
        }
        if(event==='SIGNED_IN'||event==='PASSWORD_RECOVERY'){
          applySession(session,{force:!sessionApplied,navigateHome:true});
        }
      },0);
    });

    const {data,error}=await client.auth.getSession();
    if(error)authMessage(error.message||'تعذر استعادة جلسة الدخول.','error');
    await applySession(data?.session||null,{force:true,navigateHome:Boolean(data?.session)});

    window.addEventListener('online',()=>{setSync('جارٍ الاستئناف','syncing');scheduleSave(window.English350App?.getState?.())});
  }
  window.English350Cloud={init,scheduleSave,saveNow,logout,accountHTML,renderTeamPanel,createTeam,joinTeam,copyLeagueCode,shareLeague,getUser:()=>user};
  document.addEventListener('DOMContentLoaded',init);
})();
