import NS1Assets from "../dataBase/NS1Assets.json" assert {type:"json"};
import intial_Shadow_Assets from "../dataBase/intial_shadows.json" assert {type:"json"};
import daylightAssets from "../dataBase/dayLight_shadows.json" assert {type:"json"};

let lightsArrIn,receiversArrIn,castersArrIn,lightsArrNS1, castersArrNSL1, receiversArrNSL1,lightsArrSL, castersArrSL, receiversArrSL;                                  
        
lightsArrNS1=NS1Assets.lights
receiversArrNSL1=NS1Assets.receivers;
castersArrNSL1=NS1Assets.casters; 

lightsArrIn=intial_Shadow_Assets.lights
receiversArrIn=intial_Shadow_Assets.receivers;        
castersArrIn=intial_Shadow_Assets.casters;  

lightsArrSL=daylightAssets.lights
receiversArrSL=daylightAssets.receivers;        
castersArrSL=daylightAssets.casters; 

let nls1=lightsArrNS1.length, nls2=castersArrNSL1.length,nls3=receiversArrNSL1.length;
let Is3_1=lightsArrIn.length,Is3=receiversArrIn.length,Is3_2=castersArrIn.length; 
let sl_l=lightsArrSL.length,sl_r=receiversArrSL.length,sl_c=castersArrSL.length; 
let flag=0 
let n=[]
let Floor
function shadows(scene,shadowLight,sunLight,fanLight,roomParent) {              
       
        if(flag==0){
          scene.traverse(function (child) {              
            if (child.isMesh || child.isLight) {                        
              n.push(child)                          
            }   
          });    
          
           Floor = scene.getObjectByName('Floor');     
          flag+=1
        }    
        let Spinner=document.getElementById("Spinner")      
        async function Shadows_SunLightOn(){    
          console.time("daylight shadows added")              
        for(let j=0;j<n.length;j++){  
          for(let i = 0; i < sl_l; i++) {
            if(n[j].name==lightsArrSL[i]){
              n[j].castShadow=true;                           
            }
          }                                  
         for(let i = 0; i < sl_c; i++) {
          if(n[j].name==castersArrSL[i]){
            n[j].castShadow=true;              
          }
        }
        for(let i = 0; i < sl_r; i++) {
          if(n[j].name==receiversArrSL[i]){
            n[j].receiveShadow=true;                                  
          }    
        } 
      }
        console.timeEnd("daylight shadows added")   
        }                    
        async function Shadows_SunLightOf() {                                      
          sunLight.castShadow=false 
       }                   
    let Shadows_SunLight=document.getElementById("Shadows_SunLight"); 
      Shadows_SunLight.addEventListener("change", function (e) {
        if(e.target.checked){   
        let myPromise = new Promise(function(resolve) {        
         let data=Shadows_SunLightOn()            
            resolve(data);          
          });
          myPromise.then(             
              Spinner.style.display="none"                        
          )    
        }else{                         
          Shadows_SunLightOf();          
        }                
      });
      //NIGHT LIGHT 1   
      async function Shadows_NightLight1On() {    
        Spinner.style.display="block"           

       /*  scene.traverse(function (child) {              
          if (child.isMesh) {
            child.castShadow = false; 
            child.receiveShadow = false;                                   
          }      
        });       */    
        /* roomParent.traverse(function (child) {              
          if (child.isMesh) {
            child.castShadow = false; 
            child.receiveShadow = false;                                   
          }      
        });     */     
         Floor.castShadow=false
        // Floor.receiveShadow=false
         for(let j=0;j<n.length;j++){  
          for(let i = 0; i < nls1; i++) {
            if(n[j].name==lightsArrNS1[i]){
              n[j].castShadow=true;  
            }
          }   
                               
         for(let i = 0; i < nls2; i++) {
          if(n[j].name==castersArrNSL1[i]){
            n[j].castShadow=true;              
          }
        }
        for(let i = 0; i < nls3; i++) {
          if(n[j].name==receiversArrNSL1[i]){
            n[j].receiveShadow=true;                                  
          }    
        } 
      }   
     }             
    async function Shadows_NightLight1Of() {                                      
      for(let i = 0; i < nls3; i++) {
        for(let j=0;j<n.length;j++){            
          if(n[j].name==lightsArrNS1[i]){
            n[j].castShadow=false;                                          
          }         
        }                  
       }    
   }         
function intial_shadowsOn(){   
   roomParent.traverse(function (child) {              
    if (child.isMesh) {
      child.castShadow = false; 
      child.receiveShadow = false;                                   
    }      
  });  
  for(let j=0;j<n.length;j++){      
    for(let i = 0; i < Is3_1; i++) {
      if(n[j].name==lightsArrIn[i]){
        n[j].castShadow=true;                   
      }
    }                        
    for(let i = 0; i < Is3_2; i++) {
     if(n[j].name==castersArrIn[i]){
       n[j].castShadow=true;             
     }
   }
   for(let i = 0; i < Is3; i++) {
     if(n[j].name==receiversArrIn[i]){
       n[j].receiveShadow=true;                               
     } 
   } 
 }     
}
function intial_shadowsOf(){
  for(let j=0;j<n.length;j++){      
    for(let i = 0; i < Is3_1; i++) {
      if(n[j].name==lightsArrIn[i]){
        n[j].castShadow=false;                   
      }
    }      
  }
}
 let Shadows_NightLight1=document.getElementById("Shadows_NightLight1");
   
 Shadows_NightLight1.addEventListener("change", function (e) {
  if(e.target.checked){   
  let myPromise = new Promise(function(resolve) {        
   let data=Shadows_NightLight1On()            
      resolve(data);          
    });
    myPromise.then(             
        Spinner.style.display="none"                        
    )    
  }else{                         
    Shadows_NightLight1Of();          
  }                
});
let Shadows_Initial=document.getElementById("Shadows_Initial");
Shadows_Initial.addEventListener("change",(e)=>{
  if(e.target.checked){     
    intial_shadowsOn() 
  }else{                         
    intial_shadowsOf();                      
  }
})    
 
 if(shadowLight==0){  
   Shadows_SunLightOn();    
 }else if(shadowLight==1){
  Shadows_NightLight1On();  
 } else{    
  intial_shadowsOn(); 
 }
}

export { shadows };