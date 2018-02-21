!function(a,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):(a.__ree_validate_locale__ms_MY=a.__ree_validate_locale__ms_MY||{},a.__ree_validate_locale__ms_MY.js=n())}(this,function(){"use strict";var a,n={name:"ms_MY",messages:{_default:function(a){return a+" tidak sah."},after:function(a,n){var e=n[0];return a+" perlulah selepas "+(n[1]?"atau sama dengan ":"")+e+"."},alpha_dash:function(a){return a+" boleh mempunyai karakter angka-abjad, sengkang dan garis bawah."},alpha_num:function(a){return a+" hanya boleh mempunyai karakter angka-abjad."},alpha_spaces:function(a){return a+" hanya boleh mempunyai karakter abjad termasuklah aksara ruang."},alpha:function(a){return a+" hanya boleh mempunyai karakter abjad sahaja."},before:function(a,n){var e=n[0];return a+" perlulah sebelum "+(n[1]?"atau sama dengan ":"")+e+"."},between:function(a,n){return a+" perlulah di antara "+n[0]+" dan "+n[1]+"."},confirmed:function(a){return a+" pengesahan tidak sepadan."},credit_card:function(a){return a+" tidak sah."},date_between:function(a,n){return a+" perlulah di antara "+n[0]+" dan "+n[1]+"."},date_format:function(a,n){return a+" perlulah dalam format "+n[0]+"."},decimal:function(a,n){void 0===n&&(n=[]);var e=n[0];return void 0===e&&(e="*"),a+" perlulah dalam bentuk angka dan boleh mempunyai "+(e&&"*"!==e?e:"")+" titik perpuluhan."},digits:function(a,n){return a+" perlulah dalam bentuk angka dan mempunyai "+n[0]+" digit."},dimensions:function(a,n){return a+" perlulah berdimensi "+n[0]+" pixel darab "+n[1]+" pixels."},email:function(a){return a+" perlulah dalam format emel yang sah."},ext:function(a){return a+" perlulah dalam format fail yang sah."},image:function(a){return a+" perlulah dalam bentuk imej."},in:function(a){return a+" perlulah dalam nilai yang sah."},integer:function(a){return a+" perlulah dalam bentuk integer."},ip:function(a){return a+" perlulah dalam format alamat ip yang sah."},length:function(a,n){var e=n[0],r=n[1];return r?"Panjang "+a+" perlulah bernilai di antara "+e+" dan "+r+".":"Panjang "+a+" perlulah bernilai "+e+"."},max:function(a,n){return a+" perlulah tidak melebihi "+n[0]+" karakter."},max_value:function(a,n){return a+" perlulah bernilai "+n[0]+" atau kurang."},mimes:function(a){return a+" perlulah mempunyai jenis fail yang sah."},min:function(a,n){return a+" perlulah sekurang-kurangnya mempunyai "+n[0]+" karakter."},min_value:function(a,n){return a+" perlulah bernilai "+n[0]+" atau lebih."},not_in:function(a){return a+" perlulah sah."},numeric:function(a){return a+" perlulah mempunyai hanya karakter angka sahaja."},regex:function(a){return"Format "+a+" tidak sah."},required:function(a){return a+" adalah wajib."},size:function(a,n){var e,r,t,u=n[0];return"Saiz "+a+" perlulah kurang daripada "+(e=u,r=1024,t=0==(e=Number(e)*r)?0:Math.floor(Math.log(e)/Math.log(r)),1*(e/Math.pow(r,t)).toFixed(2)+" "+["Byte","KB","MB","GB","TB","PB","EB","ZB","YB"][t])+"."},url:function(a){return a+" bukan URL yang sah."}},attributes:{}};return"undefined"!=typeof ReeValidate&&ReeValidate.Validator.localize(((a={})[n.name]=n,a)),n});