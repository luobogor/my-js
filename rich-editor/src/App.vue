<template>
  <div class="xr-editor">
    <!--按钮区-->
    <div class="nav">
      <button @click="execCommand('bold')">加粗</button>
      <button @click="execCommand('insertUnorderedList')">无序列表</button>
      <button @click="execCommand('insertHorizontalRule')">水平线</button>
      <button @click="execCommand('formatBlock', '<p>')">段落</button>
      <button @click="execCommand('undo')">后退</button>
      <button @click="execCommand('redo')">前进</button>
      <button @click="createLink">链接</button>
      <button class="nav__img">插入图片
        <!--这个 input 是隐藏的-->
        <input type="file" accept="image/gif, image/jpeg, image/png" @change="insertImg">
      </button>

    </div>
    <!--编辑区-->
    <div class="row">
      <div class="editor" contenteditable="true" @input="print"></div>
      <div class="content">{{ html }}</div>
    </div>
  </div>
</template>

<!--参考 https://juejin.im/post/5cfe4e8a6fb9a07ec63b09a4#heading-0-->

<script>
export default {
  name: 'XrEditor',
  data() {
    return {
      html: ''
    };
  },
  methods: {
    execCommand(name, args = null) {
      document.execCommand(name, false, args);
    },
    print() {
      this.html = document.querySelector('.editor').innerHTML;
    },
    insertImg(e) {
      let reader = new FileReader();
      let file = e.target.files[0];
      reader.onload = () => {
        let base64Img = reader.result;
        this.execCommand('insertImage', base64Img);
        document.querySelector('.nav__img input').value = ''; // 解决同一张图片上传无效的问题
      };
      reader.readAsDataURL(file);
    },
    createLink() {
      let url = window.prompt('请输入链接地址');
      if (url) {
        this.execCommand('createLink', url);
      }
    },
  },
  mounted() {
    this.editor = document.querySelector('.editor');
    this.editor.addEventListener('click', this.handleClick);
  }
}

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
