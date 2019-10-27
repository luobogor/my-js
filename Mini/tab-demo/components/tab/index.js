Component({
  relation: {
    name: 'tabs',
    type: 'ancestor'
  },

  props: {
    dot: Boolean,
    info: null,
    title: String,
    disabled: Boolean,
    titleStyle: String
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
    'title disabled dot info titleStyle'() {
      this.update()
    }
  },
});
