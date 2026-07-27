const K='eng350v2';
const IV=[1,3,7,16,35];
const D0=864e5;

let S={cards:{},xp:0,streak:0,last:null,started:null,seen:[],write:{},phrases:[],production:{},scenarios:{},intro:{},spoken:{}};
try{const r=localStorage.getItem(K);if(r)S=Object.assign(S,JSON.parse(r));}catch(e){}
if(!S.write)S.write={};if(!S.phrases)S.phrases=[];if(!S.production)S.production={};if(!S.scenarios)S.scenarios={};if(!S.intro)S.intro={};if(!S.spoken)S.spoken={};if(!S.theme)S.theme='system';
const save=()=>{try{localStorage.setItem(K,JSON.stringify(S))}catch(e){};window.English350Cloud?.scheduleSave?.(S)};
const AR=n=>String(n);
const esc=s=>(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---- flat icon system (replaces emoji) ---- */
const ICONP={
sun:'<path d="M16.9991 12C16.9991 14.7614 14.7605 17 11.9991 17C9.23766 17 6.99908 14.7614 6.99908 12C6.99908 9.23858 9.23766 7 11.9991 7C14.7605 7 16.9991 9.23858 16.9991 12Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M12.1247 3.25H11.9997M12.1242 20.75H11.9992M20.75 12.125V12M3.25 12.125V12M18.2752 5.90098L18.1868 5.81259M5.90051 18.275L5.81212 18.1866M18.0987 18.2756L18.187 18.1872M5.72429 5.9012L5.81267 5.81282M12.2497 3.25C12.2497 3.38807 12.1378 3.5 11.9997 3.5C11.8616 3.5 11.7497 3.38807 11.7497 3.25C11.7497 3.11193 11.8616 3 11.9997 3C12.1378 3 12.2497 3.11193 12.2497 3.25ZM12.2492 20.75C12.2492 20.8881 12.1373 21 11.9992 21C11.8611 21 11.7492 20.8881 11.7492 20.75C11.7492 20.6119 11.8611 20.5 11.9992 20.5C12.1373 20.5 12.2492 20.6119 12.2492 20.75ZM20.75 12.25C20.6119 12.25 20.5 12.1381 20.5 12C20.5 11.8619 20.6119 11.75 20.75 11.75C20.8881 11.75 21 11.8619 21 12C21 12.1381 20.8881 12.25 20.75 12.25ZM3.25 12.25C3.11193 12.25 3 12.1381 3 12C3 11.8619 3.11193 11.75 3.25 11.75C3.38807 11.75 3.5 11.8619 3.5 12C3.5 12.1381 3.38807 12.25 3.25 12.25ZM18.3636 5.98937C18.266 6.087 18.1077 6.087 18.01 5.98937C17.9124 5.89174 17.9124 5.73345 18.01 5.63582C18.1077 5.53819 18.266 5.53819 18.3636 5.63582C18.4612 5.73345 18.4612 5.89174 18.3636 5.98937ZM5.9889 18.3634C5.89127 18.461 5.73297 18.461 5.63534 18.3634C5.53771 18.2658 5.53771 18.1075 5.63534 18.0099C5.73297 17.9122 5.89127 17.9122 5.9889 18.0099C6.08653 18.1075 6.08653 18.2658 5.9889 18.3634ZM18.0103 18.364C17.9126 18.2663 17.9126 18.108 18.0103 18.0104C18.1079 17.9128 18.2662 17.9128 18.3638 18.0104C18.4614 18.108 18.4614 18.2663 18.3638 18.364C18.2662 18.4616 18.1079 18.4616 18.0103 18.364ZM5.6359 5.98959C5.53827 5.89196 5.53827 5.73367 5.6359 5.63604C5.73353 5.53841 5.89182 5.53841 5.98945 5.63604C6.08708 5.73367 6.08708 5.89196 5.98945 5.98959C5.89182 6.08722 5.73353 6.08722 5.6359 5.98959Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>',moon:'<path d="M21.5 14.0784C20.3003 14.7189 18.9301 15.0821 17.4751 15.0821C12.7491 15.0821 8.91792 11.2509 8.91792 6.52485C8.91792 5.06986 9.28105 3.69968 9.92163 2.5C5.66765 3.49698 2.5 7.31513 2.5 11.8731C2.5 17.1899 6.8101 21.5 12.1269 21.5C16.6849 21.5 20.503 18.3324 21.5 14.0784Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>',
home:'<path d="M3 11.9896V14.5C3 17.7998 3 19.4497 4.02513 20.4749C5.05025 21.5 6.70017 21.5 10 21.5H14C17.2998 21.5 18.9497 21.5 19.9749 20.4749C21 19.4497 21 17.7998 21 14.5V11.9896C21 10.3083 21 9.46773 20.6441 8.74005C20.2882 8.01237 19.6247 7.49628 18.2976 6.46411L16.2976 4.90855C14.2331 3.30285 13.2009 2.5 12 2.5C10.7991 2.5 9.76689 3.30285 7.70242 4.90855L5.70241 6.46411C4.37533 7.49628 3.71179 8.01237 3.3559 8.74005C3 9.46773 3 10.3083 3 11.9896Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M15.0002 17C14.2007 17.6224 13.1504 18 12.0002 18C10.8499 18 9.79971 17.6224 9.00018 17" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>',
book:'<path d="M15.5 7H8.5M12.499 11H8.49902" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M20 22H6C4.89543 22 4 21.1046 4 20M4 20C4 18.8954 4.89543 18 6 18H20V6C20 4.11438 20 3.17157 19.4142 2.58579C18.8284 2 17.8856 2 16 2H10C7.17157 2 5.75736 2 4.87868 2.87868C4 3.75736 4 5.17157 4 8V20Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M19.5 18C19.5 18 18.5 18.7628 18.5 20C18.5 21.2372 19.5 22 19.5 22" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>',
star:'<path d="M13.7276 3.44418L15.4874 6.99288C15.7274 7.48687 16.3673 7.9607 16.9073 8.05143L20.0969 8.58575C22.1367 8.92853 22.6167 10.4206 21.1468 11.8925L18.6671 14.3927C18.2471 14.8161 18.0172 15.6327 18.1471 16.2175L18.8571 19.3125C19.417 21.7623 18.1271 22.71 15.9774 21.4296L12.9877 19.6452C12.4478 19.3226 11.5579 19.3226 11.0079 19.6452L8.01827 21.4296C5.8785 22.71 4.57865 21.7522 5.13859 19.3125L5.84851 16.2175C5.97849 15.6327 5.74852 14.8161 5.32856 14.3927L2.84884 11.8925C1.389 10.4206 1.85895 8.92853 3.89872 8.58575L7.08837 8.05143C7.61831 7.9607 8.25824 7.48687 8.49821 6.99288L10.258 3.44418C11.2179 1.51861 12.7777 1.51861 13.7276 3.44418Z" fill="currentColor" stroke="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>',
starOutline:'<path d="M13.7276 3.44418L15.4874 6.99288C15.7274 7.48687 16.3673 7.9607 16.9073 8.05143L20.0969 8.58575C22.1367 8.92853 22.6167 10.4206 21.1468 11.8925L18.6671 14.3927C18.2471 14.8161 18.0172 15.6327 18.1471 16.2175L18.8571 19.3125C19.417 21.7623 18.1271 22.71 15.9774 21.4296L12.9877 19.6452C12.4478 19.3226 11.5579 19.3226 11.0079 19.6452L8.01827 21.4296C5.8785 22.71 4.57865 21.7522 5.13859 19.3125L5.84851 16.2175C5.97849 15.6327 5.74852 14.8161 5.32856 14.3927L2.84884 11.8925C1.389 10.4206 1.85895 8.92853 3.89872 8.58575L7.08837 8.05143C7.61831 7.9607 8.25824 7.48687 8.49821 6.99288L10.258 3.44418C11.2179 1.51861 12.7777 1.51861 13.7276 3.44418Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>',
chart:'<path d="M3.5 9.5V18.5C3.5 18.9659 3.5 19.1989 3.57612 19.3827C3.67761 19.6277 3.87229 19.8224 4.11732 19.9239C4.30109 20 4.53406 20 5 20C5.46594 20 5.69891 20 5.88268 19.9239C6.12771 19.8224 6.32239 19.6277 6.42388 19.3827C6.5 19.1989 6.5 18.9659 6.5 18.5V9.5C6.5 9.03406 6.5 8.80109 6.42388 8.61732C6.32239 8.37229 6.12771 8.17761 5.88268 8.07612C5.69891 8 5.46594 8 5 8C4.53406 8 4.30109 8 4.11732 8.07612C3.87229 8.17761 3.67761 8.37229 3.57612 8.61732C3.5 8.80109 3.5 9.03406 3.5 9.5Z" stroke="currentColor" stroke-linecap="square" stroke-linejoin="round" stroke-width="1.5"/><path d="M10.5 5.5V18.4995C10.5 18.9654 10.5 19.1984 10.5761 19.3822C10.6776 19.6272 10.8723 19.8219 11.1173 19.9234C11.3011 19.9995 11.5341 19.9995 12 19.9995C12.4659 19.9995 12.6989 19.9995 12.8827 19.9234C13.1277 19.8219 13.3224 19.6272 13.4239 19.3822C13.5 19.1984 13.5 18.9654 13.5 18.4995V5.5C13.5 5.03406 13.5 4.80109 13.4239 4.61732C13.3224 4.37229 13.1277 4.17761 12.8827 4.07612C12.6989 4 12.4659 4 12 4C11.5341 4 11.3011 4 11.1173 4.07612C10.8723 4.17761 10.6776 4.37229 10.5761 4.61732C10.5 4.80109 10.5 5.03406 10.5 5.5Z" stroke="currentColor" stroke-linecap="square" stroke-linejoin="round" stroke-width="1.5"/><path d="M17.5 12.5V18.5C17.5 18.9659 17.5 19.1989 17.5761 19.3827C17.6776 19.6277 17.8723 19.8224 18.1173 19.9239C18.3011 20 18.5341 20 19 20C19.4659 20 19.6989 20 19.8827 19.9239C20.1277 19.8224 20.3224 19.6277 20.4239 19.3827C20.5 19.1989 20.5 18.9659 20.5 18.5V12.5C20.5 12.0341 20.5 11.8011 20.4239 11.6173C20.3224 11.3723 20.1277 11.1776 19.8827 11.0761C19.6989 11 19.4659 11 19 11C18.5341 11 18.3011 11 18.1173 11.0761C17.8723 11.1776 17.6776 11.3723 17.5761 11.6173C17.5 11.8011 17.5 12.0341 17.5 12.5Z" stroke="currentColor" stroke-linecap="square" stroke-linejoin="round" stroke-width="1.5"/>',
search:'<path d="M17 17L21 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>',
settings:'<path d="M21.3175 7.14139L20.8239 6.28479C20.4506 5.63696 20.264 5.31305 19.9464 5.18388C19.6288 5.05472 19.2696 5.15664 18.5513 5.36048L17.3311 5.70418C16.8725 5.80994 16.3913 5.74994 15.9726 5.53479L15.6357 5.34042C15.2766 5.11043 15.0004 4.77133 14.8475 4.37274L14.5136 3.37536C14.294 2.71534 14.1842 2.38533 13.9228 2.19657C13.6615 2.00781 13.3143 2.00781 12.6199 2.00781H11.5051C10.8108 2.00781 10.4636 2.00781 10.2022 2.19657C9.94085 2.38533 9.83106 2.71534 9.61149 3.37536L9.27753 4.37274C9.12465 4.77133 8.84845 5.11043 8.48937 5.34042L8.15249 5.53479C7.73374 5.74994 7.25259 5.80994 6.79398 5.70418L5.57375 5.36048C4.85541 5.15664 4.49625 5.05472 4.17867 5.18388C3.86109 5.31305 3.67445 5.63696 3.30115 6.28479L2.80757 7.14139C2.45766 7.74864 2.2827 8.05227 2.31666 8.37549C2.35061 8.69871 2.58483 8.95918 3.05326 9.48012L4.0843 10.6328C4.3363 10.9518 4.51521 11.5078 4.51521 12.0077C4.51521 12.5078 4.33636 13.0636 4.08433 13.3827L3.05326 14.5354C2.58483 15.0564 2.35062 15.3168 2.31666 15.6401C2.2827 15.9633 2.45766 16.2669 2.80757 16.8741L3.30114 17.7307C3.67443 18.3785 3.86109 18.7025 4.17867 18.8316C4.49625 18.9608 4.85542 18.8589 5.57377 18.655L6.79394 18.3113C7.25263 18.2055 7.73387 18.2656 8.15267 18.4808L8.4895 18.6752C8.84851 18.9052 9.12464 19.2442 9.2775 19.6428L9.61149 20.6403C9.83106 21.3003 9.94085 21.6303 10.2022 21.8191C10.4636 22.0078 10.8108 22.0078 11.5051 22.0078H12.6199C13.3143 22.0078 13.6615 22.0078 13.9228 21.8191C14.1842 21.6303 14.294 21.3003 14.5136 20.6403L14.8476 19.6428C15.0004 19.2442 15.2765 18.9052 15.6356 18.6752L15.9724 18.4808C16.3912 18.2656 16.8724 18.2055 17.3311 18.3113L18.5513 18.655C19.2696 18.8589 19.6288 18.9608 19.9464 18.8316C20.264 18.7025 20.4506 18.3785 20.8239 17.7307L21.3175 16.8741C21.6674 16.2669 21.8423 15.9633 21.8084 15.6401C21.7744 15.3168 21.5402 15.0564 21.0718 14.5354L20.0407 13.3827C19.7887 13.0636 19.6098 12.5078 19.6098 12.0077C19.6098 11.5078 19.7888 10.9518 20.0407 10.6328L21.0718 9.48012C21.5402 8.95918 21.7744 8.69871 21.8084 8.37549C21.8423 8.05227 21.6674 7.74864 21.3175 7.14139Z" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"/><path d="M15.5195 12C15.5195 13.933 13.9525 15.5 12.0195 15.5C10.0865 15.5 8.51953 13.933 8.51953 12C8.51953 10.067 10.0865 8.5 12.0195 8.5C13.9525 8.5 15.5195 10.067 15.5195 12Z" stroke="currentColor" stroke-width="1.5"/>',
info:'<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M12 16V12" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M12.125 8.25H12M12.25 8.25C12.25 8.11193 12.1381 8 12 8C11.8619 8 11.75 8.11193 11.75 8.25C11.75 8.38807 11.8619 8.5 12 8.5C12.1381 8.5 12.25 8.38807 12.25 8.25Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>',
trophy:'<path d="M8.5 2V10.5M15.5 2V10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"/><path d="M17.9162 2.01166H6.0838C5.17286 2.01166 3.96696 1.85424 3.34398 2.69602C3 3.1608 3 3.83334 3 5.17844C3 6.32524 3 6.89864 3.23194 7.38174C3.62807 8.20684 4.51377 8.56526 5.27291 8.95504L8.98131 10.8591C10.4626 11.6197 11.2033 12 12 12C12.7967 12 13.5374 11.6197 15.0187 10.8591L18.7271 8.95504C19.4862 8.56526 20.3719 8.20684 20.7681 7.38174C21 6.89864 21 6.32524 21 5.17844C21 3.83334 21 3.1608 20.656 2.69602C20.033 1.85424 18.8271 2.01166 17.9162 2.01166Z" stroke="currentColor" stroke-width="1.5"/><path d="M10.5292 13.6376C11.2478 13.2125 11.6071 13 12 13C12.3929 13 12.7522 13.2125 13.4708 13.6376L14.4708 14.2292C15.2167 14.6704 15.5896 14.891 15.7948 15.26C16 15.6289 16 16.0789 16 16.979V18.021C16 18.9211 16 19.3711 15.7948 19.74C15.5896 20.109 15.2167 20.3296 14.4708 20.7708L13.4708 21.3624C12.7522 21.7875 12.3929 22 12 22C11.6071 22 11.2478 21.7875 10.5292 21.3624L9.52922 20.7708C8.78332 20.3296 8.41037 20.109 8.20519 19.74C8 19.3711 8 18.9211 8 18.021V16.979C8 16.0789 8 15.6289 8.20519 15.26C8.41037 14.891 8.78332 14.6704 9.52922 14.2292L10.5292 13.6376Z" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"/>',
target:'<path d="M15.1312 2.5C14.1462 2.17555 13.0936 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 10.9548 21.8396 9.94704 21.5422 9" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"/><path d="M17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M19.5 4.5L12 12M19.5 4.5V2M19.5 4.5H22" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"/>',
idea:'<path d="M5.14286 14C4.41735 12.8082 4 11.4118 4 9.91886C4 5.54539 7.58172 2 12 2C16.4183 2 20 5.54539 20 9.91886C20 11.4118 19.5827 12.8082 18.8571 14" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"/><path d="M14 10C13.3875 10.6432 12.7111 11 12 11C11.2889 11 10.6125 10.6432 10 10" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"/><path d="M7.38287 17.0982C7.291 16.8216 7.24507 16.6833 7.25042 16.5713C7.26174 16.3343 7.41114 16.1262 7.63157 16.0405C7.73579 16 7.88105 16 8.17157 16H15.8284C16.119 16 16.2642 16 16.3684 16.0405C16.5889 16.1262 16.7383 16.3343 16.7496 16.5713C16.7549 16.6833 16.709 16.8216 16.6171 17.0982C16.4473 17.6094 16.3624 17.8651 16.2315 18.072C15.9572 18.5056 15.5272 18.8167 15.0306 18.9408C14.7935 19 14.525 19 13.9881 19H10.0119C9.47495 19 9.2065 19 8.96944 18.9408C8.47283 18.8167 8.04281 18.5056 7.7685 18.072C7.63755 17.8651 7.55266 17.6094 7.38287 17.0982Z" stroke="currentColor" stroke-width="1.5"/><path d="M15 19L14.8707 19.6466C14.7293 20.3537 14.6586 20.7072 14.5001 20.9866C14.2552 21.4185 13.8582 21.7439 13.3866 21.8994C13.0816 22 12.7211 22 12 22C11.2789 22 10.9184 22 10.6134 21.8994C10.1418 21.7439 9.74484 21.4185 9.49987 20.9866C9.34144 20.7072 9.27073 20.3537 9.12932 19.6466L9 19" stroke="currentColor" stroke-width="1.5"/><path d="M12 15.5V11" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>',
eye:'<path d="M2 8C2 8 6.47715 3 12 3C17.5228 3 22 8 22 8" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"/><path d="M21.544 13.045C21.848 13.4713 22 13.6845 22 14C22 14.3155 21.848 14.5287 21.544 14.955C20.1779 16.8706 16.6892 21 12 21C7.31078 21 3.8221 16.8706 2.45604 14.955C2.15201 14.5287 2 14.3155 2 14C2 13.6845 2.15201 13.4713 2.45604 13.045C3.8221 11.1294 7.31078 7 12 7C16.6892 7 20.1779 11.1294 21.544 13.045Z" stroke="currentColor" stroke-width="1.5"/><path d="M15 14C15 12.3431 13.6569 11 12 11C10.3431 11 9 12.3431 9 14C9 15.6569 10.3431 17 12 17C13.6569 17 15 15.6569 15 14Z" stroke="currentColor" stroke-width="1.5"/>',
speaker:'<path d="M3.5 10C3.5 6.22876 3.5 4.34315 4.7448 3.17157C5.98959 2 7.99306 2 12 2C16.0069 2 18.0104 2 19.2552 3.17157C20.5 4.34315 20.5 6.22876 20.5 10V14C20.5 17.7712 20.5 19.6569 19.2552 20.8284C18.0104 22 16.0069 22 12 22C7.99306 22 5.98959 22 4.7448 20.8284C3.5 19.6569 3.5 17.7712 3.5 14V10Z" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="14.5" r="3.5" stroke="currentColor" stroke-width="1.5"/><path d="M10 6H14" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"/>',
mic:'<path d="M17 7V11C17 13.7614 14.7614 16 12 16C9.23858 16 7 13.7614 7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7Z" stroke="currentColor" stroke-width="1.5"/><path d="M17 7H14M17 11H14" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"/><path d="M20 11C20 15.4183 16.4183 19 12 19M12 19C7.58172 19 4 15.4183 4 11M12 19V22M12 22H15M12 22H9" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"/>',
lightning:'<path d="M5.22576 11.3294L12.224 2.34651C12.7713 1.64397 13.7972 2.08124 13.7972 3.01707V9.96994C13.7972 10.5305 14.1995 10.985 14.6958 10.985H18.0996C18.8729 10.985 19.2851 12.0149 18.7742 12.6706L11.776 21.6535C11.2287 22.356 10.2028 21.9188 10.2028 20.9829V14.0301C10.2028 13.4695 9.80048 13.015 9.3042 13.015H5.90035C5.12711 13.015 4.71494 11.9851 5.22576 11.3294Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>',
chat:'<path d="M7.5 8.5H16.5M7.5 12.5H13" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M2 10.5C2 9.72921 2.01346 8.97679 2.03909 8.2503C2.12282 5.87683 2.16469 4.69009 3.13007 3.71745C4.09545 2.74481 5.3157 2.6926 7.7562 2.58819C9.09517 2.5309 10.5209 2.5 12 2.5C13.4791 2.5 14.9048 2.5309 16.2438 2.58819C18.6843 2.6926 19.9046 2.74481 20.8699 3.71745C21.8353 4.69009 21.8772 5.87683 21.9609 8.2503C21.9865 8.97679 22 9.72921 22 10.5C22 11.2708 21.9865 12.0232 21.9609 12.7497C21.8772 15.1232 21.8353 16.3099 20.8699 17.2826C19.9046 18.2552 18.6843 18.3074 16.2437 18.4118C15.5098 18.4432 14.7498 18.4667 13.9693 18.4815C13.2282 18.4955 12.8576 18.5026 12.532 18.6266C12.2064 18.7506 11.9325 18.9855 11.3845 19.4553L9.20503 21.3242C9.07273 21.4376 8.90419 21.5 8.72991 21.5C8.32679 21.5 8 21.1732 8 20.7701V18.4219C7.91842 18.4186 7.83715 18.4153 7.75619 18.4118C5.31569 18.3074 4.09545 18.2552 3.13007 17.2825C2.16469 16.3099 2.12282 15.1232 2.03909 12.7497C2.01346 12.0232 2 11.2708 2 10.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>',
pin:'<path d="M13.6177 21.367C13.1841 21.773 12.6044 22 12.0011 22C11.3978 22 10.8182 21.773 10.3845 21.367C6.41302 17.626 1.09076 13.4469 3.68627 7.37966C5.08963 4.09916 8.45834 2 12.0011 2C15.5439 2 18.9126 4.09916 20.316 7.37966C22.9082 13.4393 17.599 17.6389 13.6177 21.367Z" stroke="currentColor" stroke-width="1.5"/><path d="M15.5 11C15.5 12.933 13.933 14.5 12 14.5C10.067 14.5 8.5 12.933 8.5 11C8.5 9.067 10.067 7.5 12 7.5C13.933 7.5 15.5 9.067 15.5 11Z" stroke="currentColor" stroke-width="1.5"/>',
flag:'<path d="M5.0249 21C5.04385 19.2643 5.04366 17.5541 5.0366 15.9209M5.0366 15.9209C5.01301 10.4614 4.91276 5.86186 5.19475 4.04271C5.5611 1.67939 9.39301 3.82993 13.9703 5.59842L16.0328 6.48729C17.5508 7.1415 19.7187 8.30352 18.7662 9.66084C18.3738 10.22 17.56 10.8596 16.0575 11.567L5.0366 15.9209Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>',
pencil:'<path d="M16.4249 4.60509L17.4149 3.6151C18.2351 2.79497 19.5648 2.79497 20.3849 3.6151C21.205 4.43524 21.205 5.76493 20.3849 6.58507L19.3949 7.57506M16.4249 4.60509L9.76558 11.2644C9.25807 11.772 8.89804 12.4078 8.72397 13.1041L8 16L10.8959 15.276C11.5922 15.102 12.228 14.7419 12.7356 14.2344L19.3949 7.57506M16.4249 4.60509L19.3949 7.57506" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"/><path d="M18.9999 13.5C18.9999 16.7875 18.9999 18.4312 18.092 19.5376C17.9258 19.7401 17.7401 19.9258 17.5375 20.092C16.4312 21 14.7874 21 11.4999 21H11C7.22876 21 5.34316 21 4.17159 19.8284C3.00003 18.6569 3 16.7712 3 13V12.5C3 9.21252 3 7.56879 3.90794 6.46244C4.07417 6.2599 4.2599 6.07417 4.46244 5.90794C5.56879 5 7.21252 5 10.5 5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>',
clock:'<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M12 8V12L14 14" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>',
check:'<path d="M5 13.2592L7.58583 15.9568C8.2525 16.6523 8.58583 17.0001 9.00004 17.0001C9.41425 17.0001 9.74759 16.6523 10.4143 15.9568L19 7.00006" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>',
lock:'<path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" stroke-width="1.5"/><path d="M12 13C13.1046 13 14 12.1046 14 11C14 9.89543 13.1046 9 12 9C10.8954 9 10 9.89543 10 11C10 12.1046 10.8954 13 12 13ZM12 13L12 16" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"/>',
refresh:'<path d="M20.5 5.5H9.5C5.78672 5.5 3 8.18503 3 12" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M3.5 18.5H14.5C18.2133 18.5 21 15.815 21 12" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M18.5 3C18.5 3 21 4.84122 21 5.50002C21 6.15882 18.5 8 18.5 8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M5.49998 16C5.49998 16 3.00001 17.8412 3 18.5C2.99999 19.1588 5.5 21 5.5 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>',
brain:'<path d="M15.1449 5.20762C14.5031 4.46785 13.5562 4 12.5 4C11.0033 4 9.72595 4.93951 9.22564 6.26097C8.85144 6.09327 8.43661 6 8 6C6.34315 6 5 7.34315 5 9C5 9.01673 5.00014 9.03343 5.00041 9.05009M15.1449 5.20762C15.5725 5.07274 16.0278 5 16.5 5C18.9853 5 21 7.01472 21 9.5C21 10.1296 20.8707 10.729 20.6372 11.273M15.1449 5.20762C13.7981 5.63239 12.7249 6.67345 12.2561 8C12.1435 8.31841 12.0658 8.65327 12.0275 9M9.05001 14C9.28164 15.1411 10.2905 16 11.5 16C11.7548 16 11.8823 16 11.9998 16.014C12.5855 16.0835 13.1107 16.4081 13.4348 16.9009C13.4999 16.9997 13.5569 17.1137 13.6708 17.3416L15 20M9.05001 14C9.01722 13.8384 9 13.6712 9 13.5C9 12.6822 9.39267 11.9561 9.99976 11.5M9.05001 14H4.5C3.11929 14 2 12.8807 2 11.5C2 10.1193 3.11929 9 4.5 9C4.67138 9 4.83873 9.01724 5.00041 9.05009M20.6372 11.273C20.2961 11.0985 19.9095 11 19.5 11C18.2905 11 17.2816 11.8589 17.05 13M20.6372 11.273C21.4462 11.687 22 12.5288 22 13.5C22 14.8807 20.8807 16 19.5 16C18.2904 16 17.4531 17.2082 17.8778 18.3408L18.5 20M5.00041 9.05009C5.01267 9.7988 5.2992 10.4808 5.76389 11" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>',
flame:'<path d="M12 22C16.1421 22 19.5 18.6421 19.5 14.5C19.5 13.5 19.5 11.5 17.5 9C17.5 9 17.4004 11.8536 15.4262 11.4408C12.2331 10.7732 16.3551 4.50296 10.5 2C10.5 7 4.5 8.5 4.5 14.5C4.5 18.6421 7.85786 22 12 22Z" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"/><path d="M12 19.0011C13.933 19.0011 15.5 16.9864 15.5 14.5011C12.3 15.7011 11.1667 12.9379 11 11C9.55426 11.5532 8.5 13.8256 8.5 15C8.5 17.4853 10.067 19.0011 12 19.0011Z" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"/>',
play:'<path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"/>',
chevronDown:'<path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>',
chevronLeft:'<path d="M15 18C15 18 9.00001 13.5811 9 12C8.99999 10.4188 15 6 15 6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>',
dot:'<circle cx="12" cy="12" r="9" fill="currentColor" stroke="none"/>',
};
function ic(name,cls){
  const body=ICONP[name]||'';
  return `<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="ic ${cls||''}" style="display:inline-block;vertical-align:-0.16em;flex-shrink:0">${body}</svg>`;
}

/* ---- speech ---- */
const TTS={ok:'speechSynthesis' in window,voice:null,rate:.9,list:[]};
function pickVoice(){
  if(!TTS.ok)return;
  const vs=speechSynthesis.getVoices().filter(v=>/^en(-|_|$)/i.test(v.lang));
  TTS.list=vs;
  if(!vs.length)return;
  if(S.voice){const m=vs.find(v=>v.name===S.voice);if(m){TTS.voice=m;return}}
  const pref=[/samantha/i,/daniel/i,/google (us|uk) english/i,/aria|guy|jenny/i,/en-US/i,/en-GB/i];
  for(const p of pref){const m=vs.find(v=>p.test(v.name)||p.test(v.lang));if(m){TTS.voice=m;return}}
  TTS.voice=vs[0];
}
if(TTS.ok){pickVoice();speechSynthesis.onvoiceschanged=pickVoice;}
let SPK=null;
function say(txt,btn){
  if(!TTS.ok)return;
  speechSynthesis.cancel();
  if(SPK){SPK.classList.remove('on');if(SPK===btn){SPK=null;return}}
  const u=new SpeechSynthesisUtterance(txt);
  u.lang=TTS.voice?TTS.voice.lang:'en-US';
  if(TTS.voice)u.voice=TTS.voice;
  u.rate=S.rate||TTS.rate;u.pitch=1;
  if(btn){btn.classList.add('on');SPK=btn;
    u.onend=u.onerror=()=>{btn.classList.remove('on');if(SPK===btn)SPK=null};}
  speechSynthesis.speak(u);
}
const SAY={};
let SID=0;
function spkBtn(txt,cls){
  if(!TTS.ok)return'';
  const id='s'+(++SID);SAY[id]=txt;
  return `<button class="sp ${cls||''}" onclick="event.stopPropagation();say(SAY['${id}'],this)" aria-label="استمع">${ic('speaker')}</button>`;
}
const today=()=>{const d=new Date();return Math.floor(new Date(d.getFullYear(),d.getMonth(),d.getDate())/D0)};
const ALL={};G.forEach(g=>g.items.forEach(it=>ALL[g.id+'.'+it.n]={it,g}));

function card(k){return S.cards[k]||null}
function gState(gid){
  const g=G.find(x=>x.id===gid);
  const ks=g.items.map(i=>gid+'.'+i.n);
  const st=ks.filter(k=>card(k));
  const ms=ks.filter(k=>{const c=card(k);return c&&c.lv>=2});
  return{started:st.length>0,count:st.length,mastered:ms.length,total:ks.length,
    done:ms.length===ks.length,keys:ks};
}
function unlocked(gid){
  const g=G.find(x=>x.id===gid);
  if(g&&g.section==='phrases')return true;
  if(gid===1)return true;
  const p=gState(gid-1);
  return p.mastered>=Math.ceil(p.total*0.7);
}
function curGroup(){
  for(const g of G){const s=gState(g.id);if(!s.done&&unlocked(g.id))return g.id;}
  return 35;
}
function dueList(){
  const t=today(),out=[];
  Object.keys(S.cards).forEach(k=>{const c=S.cards[k];if(c.due<=t)out.push(k)});
  return out.sort((a,b)=>S.cards[a].due-S.cards[b].due);
}
function lateCount(){const t=today();return Object.keys(S.cards).filter(k=>S.cards[k].due<t).length}

function grade(k,score){
  // score: 0=لا أعرفها 1=أعرفها قليلاً 2=أتقنتها
  let c=S.cards[k];
  if(!c)c={lv:0,due:today(),seen:0,pts:0};
  c.seen++;c.pts=(c.pts||0)+score;
  let iv;
  if(score===2){c.lv=Math.min(c.lv+1,IV.length);S.xp+=4;
    iv=IV[Math.min(c.lv-1,IV.length-1)];}
  else if(score===1){S.xp+=2;
    const base=c.lv===0?1:IV[Math.min(c.lv-1,IV.length-1)];
    iv=Math.max(1,Math.round(base/2));}
  else{c.lv=Math.max(0,c.lv-2);S.xp+=1;iv=1;}
  c.due=today()+iv;
  S.cards[k]=c;
  bumpStreak();save();
}
function bumpStreak(){
  const t=today();
  if(S.last===t)return;
  const milestones=[3,7,14,30,50,100,200,365];
  if(S.last===t-1){
    S.streak++;
    if(milestones.includes(S.streak))setTimeout(()=>celebrate('streak',{days:S.streak}),300);
  }else S.streak=1;
  S.last=t;if(!S.started)S.started=t;
}
function accuracy(){
  let s=0,p=0;Object.values(S.cards).forEach(c=>{s+=c.seen;p+=(c.pts||0)});
  return s?Math.round(p/(s*2)*100):0;
}
function learned(){return Object.values(S.cards).filter(c=>c.lv>=3).length}

function confuseFor(k){
  const {it,g}=ALL[k];
  const c=CONFUSE[it.w.toLowerCase()];
  if(c){
    const otherW=c[0], note=c[1];
    let om=null;
    if(otherW){for(const kk in ALL){if(ALL[kk].it.w.toLowerCase()===otherW){om=ALL[kk].it;break}}}
    return {kind:'known',note,other:om};
  }
  const pool=g.items.filter(x=>x.n!==it.n);
  const picks=pool.sort(()=>Math.random()-.5).slice(0,2);
  return {kind:'fallback',picks};
}

function ring(pct,size,sw){
  const r=(size-sw)/2,c=2*Math.PI*r;
  return `<svg width="${size}" height="${size}"><circle cx="${size/2}" cy="${size/2}" r="${r}"
  fill="none" stroke="var(--line)" stroke-width="${sw}"/>
  <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="var(--green)" stroke-width="${sw}"
  stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c*(1-pct/100)}"
  style="transition:stroke-dashoffset .7s"/></svg>`;
}

function wrHTML(k){
  const n=S.write[k]||0;
  if(n>=5)return `<div class="wr"><div class="done">${ic('check')} كتبتها 5 مرات</div></div>`;
  const dots=Array.from({length:5},(_,i)=>`<span class="dot ${i<n?'on':''}"></span>`).join('');
  return `<div class="wr" onclick="event.stopPropagation()">
  <div class="lb"><span>اكتب الجملة (${AR(n)}/5)</span><div class="dots">${dots}</div></div>
  <div class="row2"><input type="text" id="wi-${k.replace('.','_')}" placeholder="اكتب هنا..."
  onkeydown="if(event.key==='Enter'){event.preventDefault();wrGo('${k}')}">
  <button class="go" onclick="wrGo('${k}')">التالي</button></div></div>`;
}
function wrGo(k){
  const id='wi-'+k.replace('.','_');
  const el=document.getElementById(id);
  if(!el||!el.value.trim())return;
  S.write[k]=Math.min(5,(S.write[k]||0)+1);
  save();render();
}


function phraseSaved(k){return S.phrases.includes(k)}
function togglePhrase(k){
  const i=S.phrases.indexOf(k);if(i>=0)S.phrases.splice(i,1);else{S.phrases.push(k);S.xp+=1}
  save();render();
}
function favBtn(k){return `<button class="fav ${phraseSaved(k)?'on':''}" onclick="event.stopPropagation();togglePhrase('${k}')" title="حفظ العبارة">${phraseSaved(k)?ic('star'):ic('starOutline')}</button>`}
function lessonGoal(g){
 const maps={verbs:'تصف ما تريد وتفعل وتفكر فيه',adj:'تصف الأشخاص والأشياء والمشاعر',nouns:'تتحدث عن العمل والحياة اليومية',general:'تربط أفكارك بصورة طبيعية',phrases:'تستخدم عبارات جاهزة في محادثات حقيقية'};
 return `<div class="goal"><h3>${ic('target')} هدف المجموعة</h3><div>بعد هذه المجموعة ستستطيع أن:</div><ul><li>${maps[g.section]}</li><li>تستخدم ${AR(g.items.length)} عناصر في جمل قصيرة</li><li>تجتاز الاسترجاع والموقف التطبيقي</li></ul><div class="sub">${ic('clock')} نحو 7–10 دقائق</div></div>`;
}
function phaseHTML(){
 return `<div class="lesson-reminder"><b>${ic('idea')} تذكّر</b><div class="lesson-steps">${ic('eye')} أقرأ ─── ${ic('speaker')} أسمع ─── ${ic('brain')} أتذكر ─── ${ic('mic')} أقول</div></div>`;
}
function saveProduction(gid){const e=document.getElementById('prod-'+gid);if(!e||!e.value.trim())return;S.production[gid]=e.value.trim();S.xp+=5;save();render()}
function productionHTML(g){
 const old=S.production[g.id]||'';
 return `<div class="challenge production"><h3>${ic('pencil')} استخدم كلمات اليوم</h3><div class="sub">اكتب جملة واحدة على الأقل باستخدام أي كلمة من المجموعة.</div><textarea id="prod-${g.id}" placeholder="اكتب جملتك بالإنجليزية...">${esc(old)}</textarea><button class="b bl full" onclick="saveProduction(${g.id})">${old?'تحديث الجملة':'حفظ · +5 نقاط'}</button></div>`;
}
const SCENES={
  verbs:['في المكتب','تحتاج مساعدة في ملف وتريد أن تطلبها بأدب.'],adj:['وصف تجربة','صف اجتماعاً أو مشروعاً بثلاث صفات.'],nouns:['محادثة عمل','تحدث عن مشروع أو مشكلة أو قرار.'],general:['ربط الأفكار','قدّم رأياً مع سبب ونتيجة.'],phrases:['موقف يومي','استخدم عبارتين جاهزتين لبدء المحادثة أو إنهائها.']};
function scenarioHTML(g){
 if(g.id%5!==0&&g.section!=='phrases')return'';const sc=SCENES[g.section],old=S.scenarios[g.id]||'';
 return `<div class="challenge scenario"><h3>${ic('flag')} موقف كامل</h3><div class="situation">${ic('pin')} ${sc[0]}<br>${sc[1]}</div><textarea id="scene-${g.id}" placeholder="ماذا ستقول بالإنجليزية؟">${esc(old)}</textarea><button class="b y full" onclick="saveScenario(${g.id})">${old?'تحديث الإجابة':'حفظ الموقف · +8 نقاط'}</button></div>`;
}
function saveScenario(gid){const e=document.getElementById('scene-'+gid);if(!e||!e.value.trim())return;S.scenarios[gid]=e.value.trim();S.xp+=8;save();render()}
function abilityText(g){const x={verbs:'تطلب وتشرح ما تريده',adj:'تصف الأشياء والمشاعر',nouns:'تتحدث عن موضوعات الحياة والعمل',general:'تربط الجمل وتوضح رأيك',phrases:'ترد بسرعة دون ترجمة طويلة'};return x[g.section]}

function wordHTML(k,open){
  const {it}=ALL[k],c=card(k);
  const lv=c?c.lv:0;
  const dots='●'.repeat(lv)+'○'.repeat(5-lv);
  return `<div class="w">
  <div class="wh" onclick="tw('${k}')">
    <span class="ww">${esc(it.w)}</span>
    ${spkBtn(it.w)}
    <span class="wm">${esc(it.m)}</span>
    <span style="font-size:10px;color:var(--green);letter-spacing:1px">${dots}</span>
    <span class="cv ${open?'op':''}">${ic('chevronDown')}</span>
  </div>
  <div class="sprow"><div class="tx"><div class="se en">${esc(it.en)} ${favBtn(k)}</div>
  <div class="sa">${esc(it.ar)}</div></div>${spkBtn(it.en)}</div>
  ${open?`<div class="more">
    ${it.ex_en?`<div class="sprow"><div class="tx"><b>توسّع:</b> <span class="en" style="display:inline">${esc(it.ex_en)}</span> — ${esc(it.ex_ar)}</div>${spkBtn(it.ex_en)}</div>`:''}
    ${it.q?`<div><b>إضافة:</b> ${esc(it.q)}</div>`:''}
    ${it.blank?`<div class="en" style="color:var(--tx3)">${esc(it.blank)}</div>`:''}
  </div>`:''}
  ${it.tip?`<div class="tip"><span class="x">${esc(it.tip[0])}</span> ← <span class="v">${esc(it.tip[1])}</span></div>`:''}
  ${open?wrHTML(k):''}
  </div>`;
}
const PHRASE_EXTRA={};
function favExtraBtn(k){const sk='x:'+k;return `<button class="fav ${phraseSaved(sk)?'on':''}" onclick="event.stopPropagation();togglePhrase('${sk}')">${phraseSaved(sk)?ic('star'):ic('starOutline')}</button>`}
function dlgHTML(gid,idx){
  const d=(DIALOGUES[gid]||[])[idx];
  if(!d)return'';const g=G.find(x=>x.id===gid);
  const av=['a','b'];
  return `<div class="dlg"><div class="lb">${ic('pin')} المشهد: ${esc((SCENES[g.section]||["محادثة"])[0])} · ${ic('chat')} حوار سريع</div>
  ${d.map((ln,i)=>{const pk='d'+gid+'-'+idx+'-'+i;PHRASE_EXTRA[pk]={en:ln[0],ar:ln[1],m:'من الحوار'};return `<div class="dln"><div class="dav ${av[i%2]}">${i%2===0?'A':'B'}</div>
  <div class="dtx"><div class="e">${esc(ln[0])} ${spkBtn(ln[0])} ${favExtraBtn(pk)}</div><div class="a">${esc(ln[1])}</div></div></div>`}).join('')}
  </div>`;
}
function groupBodyHTML(g){
  let h='';
  g.items.forEach((i,idx)=>{
    h+=wordHTML(g.id+'.'+i.n,OPEN===g.id+'.'+i.n);
    if(idx===4)h+=dlgHTML(g.id,0);
    if(idx===9)h+=dlgHTML(g.id,1);
  });
  return h;
}
let OPEN=null,OPENSET=false;
function tw(k){OPEN=(OPEN===k)?null:k;OPENSET=true;render()}
function firstOf(gid){const g=G.find(x=>x.id===gid);return g?gid+'.'+g.items[0].n:null}

/* ---------- HOME ---------- */
function greetingHTML(){
  const h=new Date().getHours();
  const time=h<5?'طاب مساؤك':h<12?'صباح الخير':h<17?'طاب يومك':h<21?'مساء الخير':'طاب مساؤك';
  const due=dueList().length, started=Object.keys(S.cards).length, streak=S.streak||0;
  const pool=[
    'كل كلمة تتعلمها اليوم تقربك خطوة.',
    'الاستمرار أهم من السرعة.',
    'خمس دقائق اليوم أفضل من صفر.',
    'راجع القليل، لكن راجعه دائماً.',
    'التقدم الصغير المتكرر يصنع فرقاً كبيراً.',
  ];
  let msg;
  if(due>=10) msg=`عندك ${AR(due)} كلمة تنتظر المراجعة`;
  else if(streak>=3) msg=`سلسلتك مستمرة منذ ${AR(streak)} ${streak===1?'يوم':'أيام'} — واصل`;
  else if(started===0) msg='ابدأ أول مجموعة اليوم';
  else msg=pool[dayOfYear()%pool.length];
  return `<div style="padding:2px 2px 4px"><div style="font-size:20px;font-weight:800">${time}</div><div class="sub" style="margin-top:2px">${msg}</div></div>`;
}
function dayOfYear(){const n=new Date();const s=new Date(n.getFullYear(),0,0);return Math.floor((n-s)/864e5)}
function vHome(){
  const due=dueList(),gid=curGroup(),g=G.find(x=>x.id===gid),gs=gState(gid);
  const fluent=Object.values(S.spoken||{}).filter(n=>n>=2).length;
  const mastered=learned(), situations=Object.keys(S.scenarios||{}).length;
  const daily=G[(today()%G.length+G.length)%G.length].items[0], dk=G[(today()%G.length+G.length)%G.length].id+'.'+daily.n;
  let h=greetingHTML();
  h+=`<div class="c" style="background:linear-gradient(135deg,var(--green-l),var(--card));border:1px solid var(--hero-line)">
    <div class="sub">تقدمك العام</div><h2 style="margin:5px 0">م${AR(g.id)} — ${esc(g.title)}</h2>
    <div class="sub">${AR(gs.mastered)} من ${AR(gs.total)} عناصر متقنة</div><div class="mini" style="max-width:100%;margin:10px 0 14px"><i style="width:${gs.mastered/gs.total*100}%"></i></div>
    <button class="b g full" onclick="openDetail(${g.id})">تابع في المنهج</button></div>`;
  h+=`<div class="dash-title">تقدمك اليوم</div><div class="sg">
    <div class="sc c1"><b data-count="${Math.min(Object.keys(S.cards).length,20)}">0</b><span>كلمة تمت مراجعتها</span></div>
    <div class="sc c2"><b data-count="${mastered}">0</b><span>عبارة أو كلمة متقنة</span></div>
    <div class="sc c3"><b data-count="${Math.max(0,Math.round(S.xp/8))}">0</b><span>دقيقة تعلم</span></div></div>`;
  h+=`<div class="dash-title">إجراءات سريعة</div><div class="quickgrid">
    <button class="quick" onclick="openDetail(${g.id})"><span>${ic('play')}</span>ابدأ درسًا<small>${esc(g.title)}</small></button>
    <button class="quick" onclick="startQuick()"><span>${ic('lightning')}</span>مراجعة 60 ثانية<small>تدريب سريع</small></button>
    <button class="quick" onclick="startSpeak()"><span>${ic('mic')}</span>تحدي التحدث<small>قلها دون مساعدة</small></button></div>`;
  h+=`<div class="dash-title">التدريب على النطق</div><div class="ability">${(fluent+situations)===0
    ?`<h3>لم تبدأ بعد</h3><div class="sub">جرّب «تحدي التحدث» من الإجراءات السريعة، أو اكتب إجابة لموقف تطبيقي داخل أي مجموعة.</div>`
    :`<h3>مارست ${AR(fluent)} جملة في وضع التحدث</h3><div class="sub">وأجبت على ${AR(situations)} من المواقف اليومية التطبيقية.</div>`
    }</div>`;
  if(due.length){const late=lateCount();h+=`<div class="c" style="border-color:var(--gold);background:var(--gold-l)"><h2 style="color:var(--gold-t)">المراجعة المستحقة</h2><div class="sub" style="color:var(--gold-t);margin-bottom:12px">لديك ${AR(due.length)} كلمات أو عبارات تحتاج مراجعة${late?` · ${AR(late)} متأخرة`:''}.</div><button class="b y full" onclick="startQ('due')">راجع الآن</button></div>`;}
  h+=`<div class="dash-title">العبارة اليومية</div><div class="c"><div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start"><div><div class="en" style="font-size:19px;font-weight:800">${esc(daily.en)}</div><div class="sub" style="margin-top:5px">${esc(daily.ar)}</div></div><div>${spkBtn(daily.en,'spbig')} ${favBtn(dk)}</div></div></div>`;
  document.getElementById('v-home').innerHTML=h;
}

/* ---------- PATH ---------- */
let PDETAIL=null;
function openDetail(gid){PDETAIL=gid;OPEN=firstOf(gid);OPENSET=true;show('path')}
function closeDetail(){PDETAIL=null;render()}
function vPath(){
  if(PDETAIL){vPathDetail(PDETAIL);return}
  vPathMap();
}
function vPathMap(){
  const gid=curGroup(),g=G.find(x=>x.id===gid),gs=gState(gid);
  let h=`<div class="c" style="background:linear-gradient(135deg,var(--green-l),var(--card));border:1px solid var(--hero-line)">
    <div class="sub">المسار الحالي</div><h2 style="margin:5px 0">م${AR(g.id)} — ${esc(g.title)}</h2>
    <div class="sub">${AR(gs.mastered)} من ${AR(gs.total)} عناصر متقنة</div><div class="mini" style="max-width:100%;margin:10px 0 14px"><i style="width:${gs.mastered/gs.total*100}%"></i></div>
    <button class="b g full" onclick="openDetail(${g.id})">أكمل المسار</button></div>`;
  h+=`<div class="dash-title">باقي المنهج</div>`;
  let cs='';
  G.forEach(gr=>{
    if(gr.section!==cs){cs=gr.section;
      h+=`<div style="margin:16px 0 9px"><span class="badge bg-${gr.section}">${SEC[gr.section]} · ${AR(G.filter(x=>x.section===gr.section).length*10)} كلمة</span></div>`;}
    const s=gState(gr.id),un=unlocked(gr.id),cur=curGroup()===gr.id;
    const pct=Math.round(s.mastered/s.total*100);
    h+=`<div class="node ${!un?'lock':''} ${cur?'now':''} ${s.done?'dn':''}"
    onclick="${un?`jump(${gr.id})`:''}">
    <div class="orb ${un?'o-'+gr.section:'lk'}"><span style="font-size:20px">${s.done?ic('check'):(un?AR(gr.id):ic('lock'))}</span></div>
    <div style="flex:1"><div class="tt">${esc(gr.title)}</div>
    <div class="ds">م${AR(gr.id)} · ${AR(s.mastered)}/${AR(s.total)} مُتقنة</div></div>
    ${s.count&&!s.done?`<div class="node-ring">${ring(pct,38,4)}<span>${AR(pct)}٪</span></div>`:''}
    ${cur?'<span class="badge bg-adj">هنا</span>':''}</div>`;
  });
  document.getElementById('v-path').innerHTML=h;
}
function vPathDetail(gid){
  const g=G.find(x=>x.id===gid);
  if(!g){closeDetail();return}
  setTitle(g.title);
  let h=`<button class="backbtn" onclick="closeDetail()">${ic('chevronLeft')}رجوع للمسار</button>`;
  h+=`<div class="c"><span class="badge bg-${g.section}">${SEC[g.section]}</span><h2 style="margin-top:8px">م${AR(g.id)} — ${esc(g.title)}</h2></div>`;
  h+=lessonGoal(g);
  h+=phaseHTML();
  h+=`<div class="dash-title">كلمات المجموعة</div><div class="c flat">${groupBodyHTML(g)}</div>`;
  h+=productionHTML(g);
  h+=scenarioHTML(g);
  h+=`<button class="b bl full" style="margin:14px 0 6px" onclick="startQ(${g.id})">ابدأ الاختبار</button>`;
  document.getElementById('v-path').innerHTML=h;
}
function jump(id){openDetail(id)}

/* ---------- QUIZ ---------- */
let Q=[],QI=0,QSt='q',QR={g:0,y:0,r:0},QMode='',QLast=null;
function startQ(mode){
  SPECIAL='';clearInterval(STIMER);QMode=mode;
  if(mode==='due'){Q=dueList().slice(0,20);if(!Q.length)Q=Object.keys(S.cards).slice(0,20);if(!Q.length)Q=Object.keys(ALL).slice(0,20);}
  else{const g=G.find(x=>x.id===mode);Q=g.items.map(i=>mode+'.'+i.n);}
  if(!Q.length){show('home');return}
  Q=Q.sort(()=>Math.random()-.5);QI=0;QSt='q';QR={g:0,y:0,r:0};
  show('quiz');
}

let SPECIAL='',STIMER=null,SECONDS=60;
function startRecall(){let pool=Object.keys(S.cards);if(!pool.length)pool=Object.keys(ALL).slice(0,20);Q=pool.sort(()=>Math.random()-.5).slice(0,15);QI=0;SPECIAL='recall';QSt='q';show('quiz')}
function startQuick(){let pool=Object.keys(S.cards);if(pool.length<10)pool=Object.keys(ALL).slice(0,35);Q=pool.sort(()=>Math.random()-.5).slice(0,18);QI=0;SPECIAL='quick';QSt='q';SECONDS=60;show('quiz');clearInterval(STIMER);STIMER=setInterval(()=>{SECONDS--;const e=document.getElementById('timer');if(e)e.textContent=AR(SECONDS);if(SECONDS<=0){clearInterval(STIMER);SPECIAL='';Q=[];vQuiz()}},1000)}
function startSpeak(){let pool=Object.keys(S.cards);if(!pool.length)pool=Object.keys(ALL).slice(0,15);Q=pool.sort(()=>Math.random()-.5).slice(0,12);QI=0;SPECIAL='speak';QSt='q';show('quiz')}
function specialNext(ok){if(ok){const k=Q[QI];S.spoken[k]=(S.spoken[k]||0)+1;S.xp+=3;save()}QI++;QSt='q';vQuiz()}
function renderSpecial(el){
 if(QI>=Q.length){clearInterval(STIMER);const mode=SPECIAL;SPECIAL='';Q=[];el.innerHTML=`<div class="c" style="text-align:center;padding:30px"><div style="font-size:38px;color:var(--green-t)">${ic('trophy')}</div><h2>اكتمل التدريب</h2><div class="sub">${mode==='quick'?'أنهيت المراجعة السريعة':'أضفت تدريباً جديداً إلى طلاقتك'}</div><button class="b g full" style="margin-top:15px" onclick="render()">تم</button></div>`;return true}
 const backRow=`<button class="backbtn" onclick="exitQuiz()">${ic('chevronLeft')}خروج</button>`;
 const {it}=ALL[Q[QI]];
 if(SPECIAL==='recall'){
  setTitle('التفكير العكسي');
  el.innerHTML=`${backRow}<div class="qbar"><i style="width:${QI/Q.length*100}%"></i></div><div class="c" style="text-align:center"><div class="sub">قلها بالإنجليزية</div><h2 style="font-size:24px;margin:20px">${esc(it.ar||it.m)}</h2>${QSt==='r'?`<div class="answerbox"><b class="en">${esc(it.en||it.w)}</b><div>${spkBtn(it.en||it.w)}</div></div>`:''}</div>${QSt==='r'?`<div style="display:flex;gap:8px"><button class="b r" style="flex:1" onclick="specialNext(false)">لم أتذكر</button><button class="b g" style="flex:1" onclick="specialNext(true)">تذكرتها</button></div>`:`<button class="b bl full" onclick="QSt='r';vQuiz()">إظهار الإجابة</button>`}`;return true
 }
 if(SPECIAL==='speak'){
  setTitle('وضع التحدث');
  el.innerHTML=`${backRow}<div class="qbar"><i style="width:${QI/Q.length*100}%"></i></div><div class="c" style="text-align:center"><div class="sub">استمع ثم قلها من ذاكرتك</div><h2 class="en ${QSt==='r'?'':'hiddenanswer'}" style="font-size:22px;margin:20px">${esc(it.en)}</h2><div>${spkBtn(it.en,'spbig')}</div><div style="margin-top:12px">${esc(it.ar)}</div></div>${QSt==='r'?`<div style="display:flex;gap:8px"><button class="b r" style="flex:1" onclick="specialNext(false)">أحتاج إعادة</button><button class="b g" style="flex:1" onclick="specialNext(true)">قلتها</button></div>`:`<button class="b bl full" onclick="QSt='r';vQuiz()">كشف النص</button>`}`;return true
 }
 if(SPECIAL==='quick'){
  setTitle('مراجعة 60 ثانية');
  el.innerHTML=`${backRow}<div id="timer" class="quick-timer">${AR(SECONDS)}</div><div class="qbar"><i style="width:${QI/Q.length*100}%"></i></div><div class="c" style="text-align:center"><div class="sub">المعنى؟</div><h2 class="en" style="font-size:25px;margin:20px">${esc(it.w)}</h2>${QSt==='r'?`<div class="answerbox">${esc(it.m)}<br><span class="en">${esc(it.en)}</span></div>`:''}</div>${QSt==='r'?`<button class="b g full" onclick="specialNext(true)">التالي</button>`:`<button class="b bl full" onclick="QSt='r';vQuiz()">اكشف</button>`}`;return true
 }
 return false;
}

function celebrate(kind,data){
  const el=document.createElement('div');
  el.className='pop';
  el.onclick=(e)=>{ if(e.target===el) el.remove(); };
  if(kind==='group'){
    el.innerHTML=`<div>
      <div style="font-size:44px;color:var(--green-t)">${ic('trophy')}</div>
      <h2 style="margin:10px 0 4px">أتممت المجموعة!</h2>
      <div class="sub">${esc(data.title)} — 100٪ متقنة</div>
      <button class="b g full" style="margin-top:16px" onclick="this.closest('.pop').remove()">تابع</button>
    </div>`;
  }else if(kind==='streak'){
    el.innerHTML=`<div>
      <div style="font-size:44px;color:var(--gold-t)">${ic('flame')}</div>
      <h2 style="margin:10px 0 4px">سلسلة ${AR(data.days)} ${data.days===1?'يوم':'أيام'}!</h2>
      <div class="sub">استمر على هذا المستوى</div>
      <button class="b g full" style="margin-top:16px" onclick="this.closest('.pop').remove()">تابع</button>
    </div>`;
  }
  document.body.appendChild(el);
}
function exitQuiz(){clearInterval(STIMER);SPECIAL='';Q=[];QSt='q';vQuiz()}
function vQuiz(){
  const el=document.getElementById('v-quiz');
  if(SPECIAL&&renderSpecial(el))return;
  if(!Q.length){
    setTitle('مراجعة');
    const due=dueList();
    el.innerHTML=`<div class="c"><h2 style="margin-bottom:10px">مركز التدريب</h2>
    <div class="modegrid">
      <div class="modecard" onclick="startQ('due')"><b>${ic('brain')} المراجعة الذكية</b><span class="sub">${due.length?AR(due.length)+' كلمة مستحقة':'لا توجد كلمات مستحقة؛ يبدأ تدريب عام'}</span></div>
      <div class="modecard" onclick="startRecall()"><b>${ic('refresh')} التفكير العكسي</b><span class="sub">العربية أولاً ثم استخرج الإنجليزية</span></div>
      <div class="modecard" onclick="startQuick()"><b>${ic('lightning')} مراجعة 60 ثانية</b><span class="sub">اختبار سريع من الكلمات والجمل</span></div>
      <div class="modecard" onclick="startSpeak()"><b>${ic('mic')} وضع التحدث</b><span class="sub">استمع، أخفِ النص، ثم قل الجملة</span></div>
    </div></div>
    <div class="c"><h2 style="font-size:15px">مراجعة مجموعة محددة</h2>
    <select id="qs" style="margin-top:9px">${G.map(g=>`<option value="${g.id}">م${AR(g.id)} — ${esc(g.title)}</option>`).join('')}</select>
    <div style="margin-top:10px"><button class="b bl full" onclick="startQ(+document.getElementById('qs').value)">ابدأ</button></div></div>`;
    return;
  }
  if(QI>=Q.length){
    const tot=QR.g+QR.y+QR.r, acc=tot?Math.round((QR.g*2+QR.y)/(tot*2)*100):0;
    el.innerHTML=`<div class="c" style="text-align:center;padding:30px 18px">
    <div style="font-size:38px;color:${acc>=80?'var(--green-t)':acc>=50?'var(--gold-t)':'var(--blue-t)'}">${ic('trophy')}</div>
    <h2 style="margin:8px 0">${acc>=80?'ممتاز':acc>=50?'جيد':'واصل'}</h2>
    <div class="sg" style="margin:16px 0">
    <div class="sc"><b style="color:var(--green-t)">${AR(QR.g)}</b><span><span style="color:var(--green-t)">${ic('dot')}</span> متقنة</span></div>
    <div class="sc"><b style="color:var(--gold-t)">${AR(QR.y)}</b><span><span style="color:var(--gold-t)">${ic('dot')}</span> قليلاً</span></div>
    <div class="sc"><b style="color:var(--red-t)">${AR(QR.r)}</b><span><span style="color:var(--red-t)">${ic('dot')}</span> ما أعرفها</span></div>
    <div class="sc"><b style="color:var(--blue-t)">+${AR(QR.g*4+QR.y*2+QR.r)}</b><span>نقطة</span></div></div>
    <button class="b g full" onclick="Q=[];render()">تم</button></div>`;
    Q=[];render();return;
  }
  const k=Q[QI],{it,g}=ALL[k],pct=QI/Q.length*100;
  const backRow=`<button class="backbtn" onclick="exitQuiz()">${ic('chevronLeft')}خروج</button>`;

  if(QSt==='d'){
    const d=confuseFor(k);
    el.innerHTML=`${backRow}<div class="qbar"><i style="width:${pct}%"></i></div>
    <div class="diag">
    <div class="h">${ic('search')} ليش يمكن تخطئ فيها؟</div>
    <div class="box"><div class="l">الكلمة</div><div class="w">${esc(it.w)} — ${esc(it.m)}</div>
    <div style="font-size:13px;color:var(--tx2);margin-top:4px" class="en">${esc(it.en)}</div></div>
    ${d.kind==='known'?`
      <div class="vs">مقابل</div>
      ${d.other?`<div class="box" style="background:var(--red-l)"><div class="l">قد تخلطها مع</div>
      <div class="w">${esc(d.other.w)} — ${esc(d.other.m)}</div></div>`:''}
      <div class="note" style="margin-top:2px">${esc(d.note)}</div>`
    :`<div class="vs">كلمات من نفس المجموعة — قارن معناها</div>
      ${d.picks.map(p=>`<div class="box"><div class="w">${esc(p.w)} — ${esc(p.m)}</div></div>`).join('')}
      <div class="note">إذا ما خلطتها مع شي محدد، راجع الجملة والمثال مرة ثانية.</div>`}
    </div>
    <button class="b g full" style="margin-top:10px" onclick="nextCard()">متابعة</button>
    <div class="sub" style="text-align:center;margin-top:10px">${AR(QI+1)} من ${AR(Q.length)} · م${AR(g.id)}</div>`;
    return;
  }

  el.innerHTML=`${backRow}${(typeof QMode==='number'&&QI===0)?phaseHTML():''}<div class="qbar"><i style="width:${pct}%"></i></div>
  <div class="c" style="padding:0;overflow:hidden">
  <div class="qc"><div class="qw">${esc(it.w)} ${spkBtn(it.w)}</div><div class="qs">${esc(it.en)}</div>
  <div style="margin-top:12px">${spkBtn(it.en,'spbig')}</div>
  ${QSt==='r'?`<div class="qa">${esc(it.m)}</div><div class="qam">${esc(it.ar)}</div>
  ${it.tip?`<div class="tip" style="text-align:right;margin-top:12px"><span class="x">${esc(it.tip[0])}</span> ← <span class="v">${esc(it.tip[1])}</span></div>`:''}`:''}
  </div></div>
  ${QSt==='r'?`<div style="display:flex;gap:7px">
  <button class="b r" style="flex:1" onclick="ans(0)">${ic('dot')} لا أعرفها</button>
  <button class="b y" style="flex:1" onclick="ans(1)">${ic('dot')} قليلاً</button>
  <button class="b g" style="flex:1" onclick="ans(2)">${ic('dot')} أتقنتها</button></div>`
  :`<button class="b bl full" onclick="reveal()">اكشف</button>`}
  <div class="sub" style="text-align:center;margin-top:10px">${AR(QI+1)} من ${AR(Q.length)} · م${AR(g.id)}</div>`;
}
function reveal(){
  QSt='r';vQuiz();
  if(S.auto!==false){const {it}=ALL[Q[QI]];setTimeout(()=>say(it.en,null),120)}
}
function ans(score){
  const k=Q[QI],gid=+k.split('.')[0];
  const wasDone=gState(gid).done;
  grade(k,score);
  if(score===2)QR.g++;else if(score===1)QR.y++;else QR.r++;
  updHd();
  if(!wasDone&&gState(gid).done){
    const g=G.find(x=>x.id===gid);
    if(g)setTimeout(()=>celebrate('group',{title:g.title}),450);
  }
  if(score<2){QSt='d';vQuiz();}
  else nextCard();
}
function nextCard(){QI++;QSt='q';vQuiz();}

/* ---------- STATS ---------- */
function vStat(){
  const TOTAL=G.reduce((s,g)=>s+g.items.length,0);
  const started=Object.keys(S.cards).length,lrn=learned();
  const pct=Math.round(started/TOTAL*100),acc=accuracy();
  const days=S.started?today()-S.started+1:0;
  let lv='مبتدئ',nx='ابدأ بالمجموعة الأولى';
  if(lrn>=TOTAL-20){lv='متمكّن';nx='أنهيت المنهج — انتقل للمحادثة';}
  else if(lrn>=200){lv='متقدم';nx='اقتربت — واصل المراجعة';}
  else if(lrn>=100){lv='متوسط';nx='العمود الفقري صار عندك';}
  else if(lrn>=30){lv='مبتدئ متقدم';nx='الأساس يتشكّل';}
  const fluent=Object.values(S.spoken||{}).filter(n=>n>=2).length;
  let h=`<div class="c"><div class="ring">
  <div style="position:relative;width:104px;height:104px;flex-shrink:0">
  ${ring(pct,104,11)}
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center">
  <div class="n">${AR(pct)}%</div><div class="sub" style="font-size:11px">المنهج</div></div></div>
  <div style="flex:1"><h2>${lv}</h2><div class="sub">${nx}</div></div></div></div>

  <div class="sg" style="margin-bottom:12px">
  <div class="sc"><b style="color:var(--gold-t)">${AR(S.streak)}</b><span>يوم متتالٍ</span></div>
  <div class="sc"><b style="color:var(--blue-t)">${AR(S.xp)}</b><span>نقطة</span></div>
  <div class="sc"><b>${AR(started)}</b><span>كلمة بدأتها</span></div>
  <div class="sc"><b style="color:var(--green-t)">${AR(lrn)}</b><span>مُتقنة</span></div>
  <div class="sc"><b>${acc?AR(acc)+'%':'—'}</b><span>الدقة</span></div>
  <div class="sc"><b>${AR(days)}</b><span>يوم</span></div><div class="sc"><b style="color:var(--green-t)">${AR(fluent)}</b><span>جملة تدرّبت عليها</span></div></div>`;

  ['verbs','adj','nouns','general','phrases'].forEach(s=>{
    const gs=G.filter(g=>g.section===s);
    let c=0,t=0;gs.forEach(g=>{const st=gState(g.id);c+=st.count;t+=st.total});
    h+=`<div class="c" style="padding:13px 15px"><div style="display:flex;justify-content:space-between;margin-bottom:6px">
    <b style="font-size:14px">${SEC[s]}</b><span class="sub">${AR(c)}/${AR(t)}</span></div>
    <div class="mini" style="max-width:100%"><i style="width:${t?c/t*100:0}%"></i></div></div>`;
  });

  const doneGs=G.filter(g=>gState(g.id).mastered>=Math.ceil(g.items.length*.7));
  h+=`<div class="ability"><h3>${ic('check')} ماذا تستطيع الآن؟</h3><div class="ability-list">${doneGs.length?doneGs.slice(-6).map(g=>`<div class="ability-item"><span style="color:var(--green-t)">${ic('check')}</span><span>${abilityText(g)}</span></div>`).join(''):'<div class="sub">أتقن 70% من أول مجموعة لتظهر قدراتك هنا.</div>'}</div></div>`;
  const t=today(),up=[];
  for(let d=0;d<7;d++){const n=Object.values(S.cards).filter(c=>c.due===t+d).length;up.push(n)}
  h+=`<div class="c"><h2 style="font-size:15px;margin-bottom:10px">المراجعات القادمة</h2>
  <div style="display:flex;gap:5px;align-items:flex-end;height:70px">`;
  const mx=Math.max(...up,1);
  up.forEach((n,i)=>{h+=`<div style="flex:1;text-align:center">
  <div style="height:${n/mx*46}px;background:${i===0?'var(--gold)':'var(--blue)'};border-radius:5px 5px 0 0;min-height:${n?4:0}px"></div>
  <div style="font-size:10px;color:var(--tx2);margin-top:3px">${i===0?'اليوم':'+'+AR(i)}</div>
  <div style="font-size:10px;font-weight:800">${n?AR(n):''}</div></div>`});
  h+=`</div></div>`;
  document.getElementById('v-stat').innerHTML=h;
}
function reset(){if(confirm('حذف كل التقدم؟')){const v=S.voice,r=S.rate,a=S.auto;
S={cards:{},xp:0,streak:0,last:null,started:null,seen:[],write:{},phrases:[],production:{},scenarios:{},intro:{},spoken:{},voice:v,rate:r,auto:a};save();render();updHd()}}

/* ---------- FIND ---------- */
let FQ='';
function vFind(){
  const q=FQ.trim().toLowerCase();
  let h=`<div class="c"><input id="fi" placeholder="ابحث عن كلمة أو معنى..." value="${esc(FQ)}"
  oninput="FQ=this.value;vFind();const e=document.getElementById('fi');e.focus();e.setSelectionRange(e.value.length,e.value.length)"></div>`;
  if(q){
    let n=0,body='';
    G.forEach(g=>{
      const hits=g.items.filter(it=>it.w.toLowerCase().includes(q)||it.m.includes(q)||it.en.toLowerCase().includes(q)||it.ar.includes(q));
      if(hits.length){n+=hits.length;
        body+=`<div class="c"><h2 style="font-size:14px;margin-bottom:6px">م${AR(g.id)} — ${esc(g.title)}</h2>
        ${hits.map(i=>wordHTML(g.id+'.'+i.n,OPEN===g.id+'.'+i.n)).join('')}</div>`;}
    });
    h+=n?`<div class="sub" style="margin-bottom:8px">${AR(n)} نتيجة</div>`+body:'<div class="c">لا نتائج.</div>';
  }else{
    h+=`<div class="c flat"><div class="sub">اكتب للبحث في 350 كلمة و40 عبارة — بالإنجليزي أو العربي.</div></div>`;
  }
  document.getElementById('v-find').innerHTML=h;
}


/* ---------- SAVED PHRASES ---------- */
function getSavedPhrase(k){
 if(k.startsWith('x:')){const id=k.slice(2),x=PHRASE_EXTRA[id];return x?{en:x.en,ar:x.ar,m:x.m,k}:null}
 const x=ALL[k];return x?{en:x.it.en,ar:x.it.ar,m:x.it.m,k}:null;
}
function vPhrases(){
 const list=S.phrases.map(getSavedPhrase).filter(Boolean);
 let h=`<button class="backbtn" onclick="show('more')">${ic('chevronLeft')}رجوع</button>`;
 h+=`<div class="c"><h2>${ic('star')} عباراتي</h2><div class="sub">هذه قائمتك الشخصية، وهي مستقلة عن مسار «عبارات · 40 كلمة».</div></div>`;
 h+=list.length?list.map(x=>`<div class="favbox"><div style="display:flex;justify-content:space-between;gap:8px"><div><b class="en">${esc(x.en)}</b><div>${esc(x.ar)}</div><div class="sub">${esc(x.m||'')}</div></div><div>${spkBtn(x.en)} <button class="fav on" onclick="togglePhrase('${x.k}')">${ic('star')}</button></div></div></div>`).join(''):`<div class="c empty">اضغط ${ic('starOutline')} بجانب أي جملة لحفظها هنا.</div>`;
 document.getElementById('v-phrases').innerHTML=h;
}

/* ---------- MORE ---------- */
function openPhraseTrack(){const g=G.find(x=>x.section==='phrases');if(g)jump(g.id)}
let MORE_PANEL=null;
function toggleMorePanel(name){
  if(MORE_PANEL===name){
    const box=document.getElementById(name==='settings'?'settings-box':'about-box');
    if(box){
      box.style.animation='slOut .18s ease-in forwards';
      setTimeout(()=>{MORE_PANEL=null;render()},170);
      return;
    }
  }
  MORE_PANEL=name;render();
}
function vMore(){
 let h=`${window.English350Cloud?.accountHTML?.()||''}`+`<div class="c" style="padding:0">
 <div class="more-row" onclick="toggleMorePanel('team');setTimeout(()=>English350Cloud?.renderTeamPanel?.(),0)"><i>${ic('chart')}</i><div>تقدم المجموعة</div><span>${ic('chevronLeft')}</span></div>
 <div class="more-row" onclick="show('phrases')"><i>${ic('star')}</i><div>عباراتي المحفوظة</div><span>${ic('chevronLeft')}</span></div>
 <div class="more-row" onclick="startQuick()"><i>${ic('lightning')}</i><div>مراجعة 60 ثانية</div><span>${ic('chevronLeft')}</span></div>
 <div class="more-row" onclick="toggleMorePanel('settings')"><i>${ic('settings')}</i><div>الإعدادات</div><span>${ic('chevronLeft')}</span></div>
 <div class="more-row" onclick="toggleMorePanel('about')"><i>${ic('info')}</i><div>حول التطبيق</div><span>${ic('chevronLeft')}</span></div></div>`;
 h+=`<div id="team-box" class="c ${MORE_PANEL==='team'?'':'hide'}"><h2>تقدم المجموعة</h2><div id="team-panel"><div class="sub">افتح القسم لتحميل البيانات.</div></div></div>`;
 h+=`<div id="settings-box" class="c ${MORE_PANEL==='settings'?'':'hide'}"><h2>الإعدادات</h2>
 <div class="sub" style="margin:10px 0 5px">المظهر</div>
 <div class="seg">
 <button class="${(S.theme||'system')==='light'?'on':''}" onclick="setTheme('light')">${ic('sun')} فاتح</button>
 <button class="${(S.theme||'system')==='dark'?'on':''}" onclick="setTheme('dark')">${ic('moon')} داكن</button>
 <button class="${(S.theme||'system')==='system'?'on':''}" onclick="setTheme('system')">${ic('settings')} النظام</button>
 </div>
 ${TTS.ok?`<div class="sub" style="margin:14px 0 5px">الصوت</div><select onchange="S.voice=this.value;save();pickVoice()">${TTS.list.map(v=>`<option value="${esc(v.name)}" ${TTS.voice&&TTS.voice.name===v.name?'selected':''}>${esc(v.name)} (${esc(v.lang)})</option>`).join('')}</select><div class="sub" style="margin:12px 0 5px">سرعة النطق</div><input type="range" min="0.5" max="1.3" step="0.1" value="${S.rate||.9}" onchange="S.rate=+this.value;save()">`:''}<button class="b gh full" style="margin-top:15px" onclick="reset()">إعادة تعيين التقدم</button></div>`;
 h+=`<div id="about-box" class="c ${MORE_PANEL==='about'?'':'hide'}"><h2>حول التطبيق</h2><div class="sub">منهج الإنجليزية — تجربة تعلم مركزة تجمع الكلمات والعبارات والمراجعة والتحدث.</div></div>`;
 document.getElementById('v-more').innerHTML=h;
}

/* ---------- SHELL ---------- */
let V='home';
function updHd(){
  countTo(document.getElementById('h-st'),S.streak);
  countTo(document.getElementById('h-xp'),S.xp);
  countTo(document.getElementById('h-dw'),dueList().length);
  const stChip=document.querySelector('.chip.st');
  if(stChip)stChip.classList.toggle('pulse',(S.streak||0)>0);
}
function show(v){
  V=v;
  document.querySelectorAll('.view').forEach(x=>x.classList.add('hide'));
  const el=document.getElementById('v-'+v);
  el.classList.remove('hide');el.style.animation='none';void el.offsetWidth;el.style.animation='';
  document.querySelectorAll('.nv').forEach(b=>b.classList.toggle('on',b.dataset.v===v));
  render();window.scrollTo(0,0);
}
const TITLES={home:'الرئيسية',path:'المنهج',quiz:'مراجعة',stat:'التقدم',find:'بحث',phrases:'عباراتي',more:'المزيد'};
function setTitle(t){const e=document.getElementById('pagetitle');if(e)e.textContent=t}
function countTo(el,target){
  if(!el)return;
  const cur=parseInt(el.textContent)||0;
  if(cur===target){el.textContent=AR(target);return}
  const t0=performance.now(),dur=500;
  function step(t){
    const p=Math.min(1,(t-t0)/dur),eased=1-Math.pow(1-p,3);
    el.textContent=AR(Math.round(cur+(target-cur)*eased));
    if(p<1)requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
function animateCounts(root){
  (root||document).querySelectorAll('[data-count]').forEach(el=>{
    const target=+el.dataset.count,t0=performance.now(),dur=600;
    function step(t){
      const p=Math.min(1,(t-t0)/dur),eased=1-Math.pow(1-p,3);
      el.textContent=AR(Math.round(target*eased));
      if(p<1)requestAnimationFrame(step);else el.textContent=AR(target);
    }
    requestAnimationFrame(step);
  });
}
function render(){
  for(const k in SAY)delete SAY[k];SID=0;
  setTitle(TITLES[V]||'منهج الإنجليزية');
  ({home:vHome,path:vPath,quiz:vQuiz,stat:vStat,find:vFind,phrases:vPhrases,more:vMore})[V]();
  updHd();mountIcons();animateCounts();
}
function applyTheme(){document.documentElement.dataset.theme=S.theme||'system'}
function setTheme(t){S.theme=t;save();applyTheme();render()}
function mountIcons(root){
  (root||document).querySelectorAll('[data-ic]').forEach(el=>{
    if(el.dataset.mounted)return;
    el.innerHTML=ic(el.dataset.ic);el.dataset.mounted='1';
  });
}
document.querySelectorAll('.nv').forEach(b=>b.onclick=()=>show(b.dataset.v));
applyTheme();
mountIcons();
show('home');

window.English350App={
 getState:()=>JSON.parse(JSON.stringify(S)),
 replaceState:(next)=>{S=Object.assign({cards:{},xp:0,streak:0,last:null,started:null,seen:[],write:{},phrases:[],production:{},scenarios:{},intro:{},spoken:{},theme:'system'},next||{});try{localStorage.setItem(K,JSON.stringify(S))}catch(e){};applyTheme();render()},
 render:()=>render()
};
