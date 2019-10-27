import behavior from "../../common/behavior";

Component({
  behaviors: [behavior],

  relations: {
    '../tabs/index' :{
      type: 'ancestor'
    },
  },

  properties: {
    dot: {
      type: Boolean,
      value: false
    },
    title:  {
      type: String,
      value: ''
    },
    disabled: {
      type: Boolean,
      value: false
    },
    titleStyle: {
      type: String,
      value: ''
    },
  },


  data: {
    width: null,
    inited: false,
    active: false,
    animated: false
  },

  methods: {
    update() {
      const parent = this.getRelationNodes('../tabs/index')[0];
      if (parent) {
        parent.updateTabs();
      }
    }
  },

  observers: {
    'title, disabled, dot, titleStyle'() {
      this.update()
    }
  },
});
