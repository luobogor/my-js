<template>
  <div class="xr-editor">
    <!--按钮区-->
    <div class="nav">
      <button @click="execCommand">加粗</button>
    </div>
    <!--编辑区-->
    <div class="editor" contenteditable="true"></div>
  </div>
</template>

<script>
export default {
  name: 'XrEditor',
  methods: {
    execCommand() {
      document.execCommand('bold', false, null);
    }
  }
};
</script>
<!--全部样式就这些，这里就都先给出来了-->
<style lang="scss">
.xr-editor {
  margin: 50px auto;
  width: 1000px;

  .nav {
    display: flex;

    button {
      cursor: pointer;
    }

    &__img {
      position: relative;

      input {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        opacity: 0;
      }
    }
  }

  .row {
    display: flex;
    width: 100%;
    height: 300px;
  }

  .editor {
    flex: 1;
    position: relative;
    margin-right: 20px;
    padding: 10px;
    outline: none;
    border: 1px solid #000;
    overflow-y: scroll;

    img {
      max-width: 300px;
      max-height: 300px;
      vertical-align: middle;
    }
  }

  .content {
    flex: 1;
    border: 1px solid #000;
    word-break: break-all;
    word-wrap: break-word;
    overflow: scroll;
  }
}
</style>
