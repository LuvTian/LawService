import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();
Page({
  data: {
    sForm:{
      name:'',
      phone:'',
      code:'',
      passage1:'', 
  
    },
    isFirstLoadAllStandard:['userInfoGet'],
  },


  onLoad: function () {
    const self = this;
   	api.commonInit(self);  
    self.userInfoGet();
  },

  formIdAdd(e){
    api.WxFormIdAdd(e.detail.formId,(new Date()).getTime()/1000+7*86400);  
  },

  userInfoGet(){
    const self = this;
    const postData = {};
    postData.tokenFuncName = 'getProjectToken';
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.sForm.name = res.info.data[0].info.name;
        self.data.sForm.phone = res.info.data[0].info.phone; 
        self.data.sForm.passage1 = res.info.data[0].info.passage1;
      }; 
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'userInfoGet',self);
      self.setData({
        web_sForm:self.data.sForm,
      });
      
    };
    api.userGet(postData,callback);
  },

  changeBind(e){
    const self = this;
    if(api.getDataSet(e,'value')){
      self.data.sForm[api.getDataSet(e,'key')] = api.getDataSet(e,'value');
    }else{
      api.fillChange(e,self,'sForm');
    };
    console.log(self.data.sForm);
    self.setData({
      web_sForm:self.data.sForm,
    });  
  },

  register(){
    const self = this;
    const postData = {};
    postData.tokenFuncName = 'getProjectToken';
    postData.data = {};
    postData.data = api.cloneForm(self.data.sForm);
    const callback = (res)=>{
			api.buttonCanClick(self,true);
      if(res.solely_code==100000){
        api.showToast('完善成功','none')
        setTimeout(function(){
          api.pathTo('/pages/user/user','rela')
        },1000);
      }else{
        api.showToast(res.msg,'none')
      };
      
    };
    api.register(postData,callback);
  },

  submit(){
    const self = this;
    api.buttonCanClick(self);
    var phone = self.data.sForm.phone;
		var newObject = api.cloneForm(self.data.sForm);
		delete newObject.passage1;
		delete newObject.code;
    const pass = api.checkComplete(newObject);
    if(pass){
      if(phone.trim().length != 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)){
        api.buttonCanClick(self,true);
        api.showToast('手机格式不正确','none')
        
      }else{
        const callback = (user,res) =>{
          self.register(); 
       };
       api.getAuthSetting(callback);   
     }
   }else{
      api.buttonCanClick(self,true);
      api.showToast('请补全信息','none');    
   };
  },

  
})
