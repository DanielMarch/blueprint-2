(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    $('#building > tbody > tr > td').mousedown(select);
    $('#building > tbody > tr > td').mouseup(selectRelease);
  }

  function select(){
    var thisId = $(this).data('id').toArray();
    // var x = thisId.split(',')[0];
    // var y = thisId.split(',')[1];
    console.log(thisId);
    // console.log(y);
  }

  function selectRelease(){
    console.log($(this).data('id'));
  }

})();
