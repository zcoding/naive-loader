function render(h, _) {
  var state = this.state;
  return h("div", {"class":"hello",":shit":'ha',":style":{background: state.bgcolor},":data-dd":state.dataId,"data-id":"state.dataId"}, [
    "\n  ",
    h("div", {"class":"loading","n-show":state.loadingData}, [
      state.status
    ], "47b90607-773c-40df-b201-47d91dadc0fd"),
    "\n  ",
    h("input", {"type":"text","n-model":state.counter}, [], "862a3f3d-a9f7-4858-8812-6c0a8c94291d"),
    "\n  ",
    h("div", {"class":"world","n-show":!state.loadingData && state.show}, [
      "\n    ",
      h("ul", {"class":"list"}, [
        "\n      ",
        _.each(state.list, function(item, $index, $key) { return {key: "9790b2f4-cf64-48e9-82be-84acd07c241e-" + $key, tagName: "li", attrs: {"class":"item"}, children: [
          "\n        ",
          h("a", {"href":"javascript:;",":class":{'success': state.success}}, [
            $index," : ",item.name
          ], "3ed80e96-2181-4d16-ae1d-788dbac05e68"),
          "\n      "
        ]};}),
        "\n    "
      ], "85b31957-a49f-469b-8cc7-d2c0d6f45dd5"),
      "\n  "
    ], "a4bb27d3-ff3d-4f2f-996c-b28741b07e49"),
    "\n  ",
    _.if(state.abc, {key: "abf94cf8-9982-484f-9288-48ffd7a4e720", tagName: "div", attrs: {}, children: [
      "abcabcabc"
    ]}),
    "\n  ",
    _.if(!(state.abc), {key: "91be3ba7-1516-4bf2-8e03-d953a9030624", tagName: "div", attrs: {}, children: [
      "not abc"
    ]}),
    "\n  ",
    _.each(state.messageList, function(item, $index, $key) { return {key: "30a74509-4749-4633-9124-bb107abfced9-" + $key, tagName: "div", attrs: {"class":"message-list"}, children: [
      "\n    ",
      h("div", {"class":"message-item"}, [
        item.content
      ], "d4e09b18-30db-4458-b101-32404e84fc40"),
      "\n  "
    ]};}),
    "\n  ",
    h("side-bar", {":props":1}, [], "7dec4818-6c7f-4955-80bf-73e319d72748"),
    "\n  ",
    h("side-bar", {":props":2}, [], "fdc5dea6-ab6e-445f-bc30-423282b686e9"),
    "\n  ",
    h("div", {"class":"action"}, [
      "\n    ",
      h("button", {"class":"btn","type":"button","@click":this.handleSubmit,":disabled":!state.canSubmit}, [
        "submit"
      ], "695d3004-71f6-41e5-9853-73019046c90f"),
      "\n  "
    ], "948985b8-0cd3-4f47-a80d-cbb9ec46a5ff"),
    "\n  ",
    h("svg", {"version":"1.1","class":"submittick","xmlns":"http://www.w3.org/2000/svg","xlink":"http://www.w3.org/1999/xlink","x":"0px","y":"0px","viewBox":"-245.2 405.8 27 27","space":"preserve","width":"32","height":"32"}, [
      "\n    ",
      h("g", {}, [
        "\n      ",
        h("line", {"class":"st0 stline1","x1":"-238.8","y1":"416.7","x2":"-231.8","y2":"424.7"}, [], "24215d8c-5ea7-48f2-b09b-ee86cf0dc21e"),
        "\n      ",
        h("line", {"class":"st0 stline2","x1":"-231.8","y1":"424.7","x2":"-219.2","y2":"409.4"}, [], "ce266519-ec35-44a5-a919-02c93b3c3794"),
        "\n      ",
        h("path", {"class":"st0 stpath","d":"M-220.3,415.9c0.3,1.1,0.5,2.3,0.5,3.5c0,6.6-5.4,12-12,12c-6.6,0-12-5.4-12-12s5.4-12,12-12 c2.6,0,5,0.8,6.9,2.2"}, [], "6ee94341-a7c8-4c6a-a5ed-5590dae5c503"),
        "\n    "
      ], "0be28cd8-9129-472d-9578-3133b3d01415"),
      "\n  "
    ], "2b494126-5579-4698-a8b7-cac37f31f3b4"),
    "\n"
  ], "b2533342-2b0e-44a7-85c6-b130bd433d42");
}

