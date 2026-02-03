module.exports=[62179,a=>{"use strict";var b=a.i(45618);a.s(["createClerkSupabaseClient",0,a=>(0,b.createClient)("https://cnfmdfwpicltzthzglzj.supabase.co","sb_publishable_H4700JmeezyvZawo6rovMA_z2uVjZuv",{global:{headers:a?{Authorization:`Bearer ${a}`}:void 0}})])},2110,77728,27607,a=>{"use strict";var b=a.i(37936),c=a.i(5072),d=a.i(62179),e=a.i(13095);async function f(){try{let{userId:a,getToken:b}=await (0,c.auth)();if(!a)return"free";let e=await b({template:"supabase"}),f=(0,d.createClerkSupabaseClient)(e),{data:g}=await f.from("profiles").select("subscription_tier").eq("id",a).single();return(g?.subscription_tier||"free").toLowerCase()}catch(a){return console.error("Error fetching subscription:",a),"free"}}async function g(){let{userId:a,getToken:b}=await (0,c.auth)();if(!a)return null;try{let c=await b({template:"supabase"}),e=(0,d.createClerkSupabaseClient)(c),{data:f}=await e.from("profiles").select("role").eq("id",a).single();return f?.role||"user"}catch(a){return console.error("Failed to fetch user role",a),"user"}}(0,e.ensureServerEntryExports)([f]),(0,b.registerServerReference)(f,"0003a3dcf615081a16c914805a79b1208e05658d88",null),a.s(["getUserSubscription",()=>f],2110),(0,e.ensureServerEntryExports)([g]),(0,b.registerServerReference)(g,"0051101ac87c471b7462d604cadbab8a2e54996392",null),a.s(["getUserRole",()=>g],77728);var h=a.i(5246);async function i(){(await (0,h.cookies)()).delete(`__clerk_invalidate_cache_cookie_${Date.now()}`)}(0,e.ensureServerEntryExports)([i]),(0,b.registerServerReference)(i,"00fb695b95eb42dc75b9b2e7e86571a2d3342b32bb",null),a.s(["invalidateCacheAction",()=>i],27607)},63733,a=>{"use strict";var b=a.i(2110),c=a.i(77728),d=a.i(26022),e=a.i(27607),f=a.i(85978),g=a.i(37936),h=a.i(12746),i=a.i(87128),j=a.i(45069),k=a.i(13095);async function l(){if(!await (0,i.isAdmin)())throw Error("Unauthorized Access")}async function m(){await l();let a=(0,h.createAdminClient)(),{count:b,error:c}=await a.from("profiles").select("*",{count:"exact",head:!0}),{count:d,error:e}=await a.from("contact_messages").select("*",{count:"exact",head:!0}),{count:f,error:g}=await a.from("contact_messages").select("*",{count:"exact",head:!0}).eq("status","unread");return c||e||g?(console.error("Error fetching stats",c,e,g),{totalUsers:0,totalMessages:0,unreadMessages:0}):{totalUsers:b||0,totalMessages:d||0,unreadMessages:f||0}}async function n(){await l();let a=(0,h.createAdminClient)(),{data:b,error:c}=await a.from("profiles").select("*").order("created_at",{ascending:!1}).limit(100);return c?(console.error("Error fetching users",c),[]):b}async function o(){await l();let a=(0,h.createAdminClient)(),{data:b,error:c}=await a.from("contact_messages").select("*").order("created_at",{ascending:!1}).limit(100);return c?(console.error("Error fetching messages",c),[]):b}async function p(a,b){await l();let c=(0,h.createAdminClient)(),d=b.get("subject"),e=b.get("message");if(!d||!e)return{error:"Title and Message are required"};let{error:f}=await c.from("notifications").insert({title:d,message:e,type:"info",user_id:null});return f?(console.error("Failed to create notification",f),{error:"Failed to publish notification"}):{success:!0,message:"Notification published to all users."}}async function q(a,b){await l();let c=(0,h.createAdminClient)(),{error:d}=await c.from("contact_messages").update({status:b}).eq("id",a);return d?(console.error("Error updating message status",d),{error:"Failed to update status"}):{success:!0}}let r=new j.Resend(process.env.RESEND_API_KEY);async function s(a,b,c,d){if(await l(),!process.env.RESEND_API_KEY)return{error:"RESEND_API_KEY is missing"};try{let{data:e,error:f}=await r.emails.send({from:"PromptForge AI <admin@promptforgeai.com>",to:[a],subject:b.startsWith("Re:")?b:`Re: ${b}`,html:`
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Inter', sans-serif; background-color: #000000; color: #ffffff; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #18181b; border: 1px solid #333; border-radius: 12px; margin-top: 40px; }
                    .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid #333; margin-bottom: 20px; }
                    .logo { height: 40px; }
                    .content { font-size: 16px; line-height: 1.6; color: #e5e7eb; }
                    .quote { margin-top: 20px; padding: 15px; background-color: #27272a; border-left: 4px solid #8b5cf6; color: #9ca3af; font-size: 14px; border-radius: 4px; }
                    .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #333; padding-top: 20px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                         <!-- Assuming public folder is served at root domain. If not, user needs updates -->
                        <img src="${process.env.NEXT_PUBLIC_APP_URL||"https://promptforge.ai"}/logo_navi.png" alt="PromptForge AI" class="logo" />
                    </div>
                    
                    <div class="content">
                        ${d.replace(/\n/g,"<br/>")}
                    </div>

                    <div class="quote">
                        <strong>On ${new Date().toLocaleDateString()}, you wrote:</strong><br/>
                        ${c}
                    </div>

                    <div class="footer">
                        &copy; ${new Date().getFullYear()} PromptForge AI. All rights reserved.
                    </div>
                </div>
            </body>
            </html>
            `});if(f)return console.error("Resend Error:",f),{error:f.message};return{success:!0}}catch(a){return console.error("Failed to send email:",a),{error:"Internal Server Error"}}}(0,k.ensureServerEntryExports)([m,n,o,p,q,s]),(0,g.registerServerReference)(m,"00b097554662331b18367ba80cd05ccb530331738b",null),(0,g.registerServerReference)(n,"008c60efefc397f629252e2ed7eb0e8e19e03a7c1a",null),(0,g.registerServerReference)(o,"00ccf8bd70c4ef8697da5158f290d1f1fa493c258d",null),(0,g.registerServerReference)(p,"60b927a94dbbb997de4c477625b6eddf66d4916cff",null),(0,g.registerServerReference)(q,"602d86472a27033ecc9fd12e36af4ff1db69022ce5",null),(0,g.registerServerReference)(s,"783f3bdbbc3344bd200d335c9a9c1e57a1120fc975",null),a.s([],33152),a.i(33152),a.s(["0003a3dcf615081a16c914805a79b1208e05658d88",()=>b.getUserSubscription,"000c5950602641cd8b0661a788cb4fb705def1b4b1",()=>d.createOrReadKeylessAction,"0051101ac87c471b7462d604cadbab8a2e54996392",()=>c.getUserRole,"0064afb0bd84c5266927f4777c8f0ddd5c7e626c6a",()=>d.deleteKeylessAction,"008a5782a58bd8eba0077f5b1e478761fed9d410df",()=>f.collectKeylessMetadata,"008c60efefc397f629252e2ed7eb0e8e19e03a7c1a",()=>n,"00b097554662331b18367ba80cd05ccb530331738b",()=>m,"00ccf8bd70c4ef8697da5158f290d1f1fa493c258d",()=>o,"00d33c04adba09f9320585b6cd2442fddc67121317",()=>d.detectKeylessEnvDriftAction,"00fb695b95eb42dc75b9b2e7e86571a2d3342b32bb",()=>e.invalidateCacheAction,"40e8dbb7737be346be89256c32890a354586b96faf",()=>f.formatMetadataHeaders,"40efc55e4105d4adbc9874f14cc1c800be70aff8bc",()=>d.syncKeylessConfigAction,"602d86472a27033ecc9fd12e36af4ff1db69022ce5",()=>q,"60b927a94dbbb997de4c477625b6eddf66d4916cff",()=>p,"783f3bdbbc3344bd200d335c9a9c1e57a1120fc975",()=>s],63733)}];

//# sourceMappingURL=_bd62de77._.js.map