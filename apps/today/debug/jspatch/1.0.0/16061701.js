require('UIView, UIView+Toast')
defineClass('ViewController', {
  __testJsPatch: function() {
  	self.view.makeToast("JsPatchToast");
  }
});
