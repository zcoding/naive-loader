function render(h, _) {
  return [
    "\n  \n",
    h("div", [{"name":"class","value":"component1"}], [
      "\n  ",
      _.if(_.s("show"), {tagName: "side-bar", attrs: [{"name":"n-if","value":"show"}], children: [
        "\n    ",
        h("ul", [], [
          "\n      ",
          _.each({tagName: "li", attrs: [{"name":"class","value":"item"},{"name":"n-each","value":"item in list"}], children: [
            "\n        ",
            h("a", [{"name":"href","value":"www.baidu.com"}], [
              _.s("item.value"),
              h("button", [{"name":"type","value":"button"}], [
                "clickeme"
              ])
            ]),
            "\n      "
          ]}),
          "\n    "
        ]),
        "\n  "
      ]}),
      "\n  ",
      h("div", [{"name":"class","value":"hello"},{"name":"n-else","value":""}], []),
      "\n"
    ]),
    "\n\n"
  ];
}


  
export default {
  state: {},
  methods: {}
}


componentOptions.render = render;
export default componentOptions;
