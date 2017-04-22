function render(h, _) {
  var $vm = this;
  var $state = $vm.state;
  var _uid = "c091d582-2e50-4cd0-96ea-e6b0594726c4";
  return h("div", {"class":"hello",":shit":'ha',":style":{ transform: 'translate3d(1px,2px,3px)' },":dataDd":$state.dataId,"data-id":"dataId"}, [
    " ",
    h("div", {"class":"loading","n-show":"loadingData"}, [
      $state.status
    ], _uid + "-3"),
    " ",
    h("input", {"type":"text","n-model":"counter"}, [], _uid + "-4"),
    " ",
    h("div", {"class":"world","n-show":"!loadingData && show"}, [
      " ",
      h("ul", {"class":"list"}, [
        " ",
        _.each($state.list, 3, function(item, key, idx, $item_uid) { return {key: _uid + "-7" + "-" + (item.id || $item_uid), tagName: "li", attrs: {"class":"item",":key":item.id}, children: [
          " ",
          h("a", {"href":"javascript:;",":class":{ 'success': $state.success }}, [
            idx,
            " : ",
            item.name
          ], _uid + "-8"),
          " "
        ]}; }),
        " "
      ], _uid + "-6"),
      " "
    ], _uid + "-5"),
    " ",
    _.if($state.abc, {key: _uid + "-9", tagName: "div", attrs: {}, children: [
      "abcabcabc"
    ]}),
    " ",
    _.if(!($state.abc), {key: _uid + "-10", tagName: "div", attrs: {}, children: [
      "not abc"
    ]}),
    " ",
    _.each($state.messageList, 1, function(item, $item_uid) { return {key: _uid + "-11" + "-" + $item_uid, tagName: "div", attrs: {"class":"message-list"}, children: [
      " ",
      h("div", {"class":"message-item"}, [
        item.content
      ], _uid + "-12"),
      " "
    ]}; }),
    " ",
    h("side-bar", {":props":1}, [], _uid + "-13"),
    " ",
    h("side-bar", {":props":2}, [], _uid + "-14"),
    " ",
    h("div", {"class":"action"}, [
      " ",
      h("button", {"class":"btn","type":"button","@click":function ($event) { return $vm.handleSubmit($event); },":disabled":!$state.canSubmit}, [
        "submit"
      ], _uid + "-16"),
      " "
    ], _uid + "-15"),
    " ",
    h("svg", {"version":"1.1","class":"submittick","xmlns":"http://www.w3.org/2000/svg","xlink":"http://www.w3.org/1999/xlink","x":"0px","y":"0px","viewBox":"-245.2 405.8 27 27","space":"preserve","width":"32","height":"32"}, [
      " ",
      h("g", {}, [
        " ",
        h("line", {"class":"st0 stline1","x1":"-238.8","y1":"416.7","x2":"-231.8","y2":"424.7"}, [], _uid + "-19"),
        " ",
        h("line", {"class":"st0 stline2","x1":"-231.8","y1":"424.7","x2":"-219.2","y2":"409.4"}, [], _uid + "-20"),
        " ",
        h("path", {"class":"st0 stpath","d":"M-220.3,415.9c0.3,1.1,0.5,2.3,0.5,3.5c0,6.6-5.4,12-12,12c-6.6,0-12-5.4-12-12s5.4-12,12-12 c2.6,0,5,0.8,6.9,2.2"}, [], _uid + "-21"),
        " "
      ], _uid + "-18"),
      " "
    ], _uid + "-17"),
    " "
  ], _uid + "-2");
}

