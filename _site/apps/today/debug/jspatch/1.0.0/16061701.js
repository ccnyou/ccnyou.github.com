require('UIView')
defineClass('ViewController', {
  __testJsPatch: function() {
  	self.view().makeToast("Hello JsPatch");
  }
});
