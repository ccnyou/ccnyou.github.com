require('UIView, UIColor, UILabel')
defineClass('ViewController', {
  // replace the -genView method
  __testJsPatch: function() {
  	self.view.makeToast("JsPatchToast");
  }
});
