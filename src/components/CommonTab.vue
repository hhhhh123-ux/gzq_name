<template>
  <div class="vab-tabs">
    <el-tabs
      v-model="activeTab"
      type="card"
      @tab-remove="removeTab"
      @tab-click="tabClick"
    >
      <el-tab-pane
        v-for="item in tabsItem"
        :key="item.name"
        :label="item.meta.title"
        :name="item.name"
        :closable="item.closable"
        :ref="item.ref"
      >
      </el-tab-pane>
    </el-tabs>
    <el-dropdown trigger="click" style="cursor: pointer; float: right">
      <span class="el-dropdown-link"><svg-icon icon-class="drag" /></span>
      <el-dropdown-menu class="tabs-more">
        <el-dropdown-item>关闭全部页面</el-dropdown-item>
        <el-dropdown-item>刷新页面</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>


<script>
import { handleActivePath, handleTabs } from "@/utils/routes";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Tab",
  data() {
    return {
      activeTab: "1",
      tabIndex: 1,
      tabsItem: [
        {
          name: "1",
          closable: false,
          ref: "tabs",
          meta: {
            title: "首页",
          },
        },
      ],
      tabsPath: [
        {
          name: "1",
          path: "/Index",
        },
      ],
    };
  },
  mounted() {
    /*
     * 监听页面刷新事件
     * 页面刷新前 需要保存当前打开的tabs的位置，刷新后按刷新前的顺序展示
     * 使用js的sessionStorage保存刷新页面前的数据
     * */
    window.addEventListener("beforeunload", (e) => {
      sessionStorage.setItem(
        "tabsItem",
        JSON.stringify({
          currTabsItem: this.tabsItem.filter((item) => item.name !== "1"),
          currTabsPath: this.tabsPath.filter((item) => item.name !== "1"),
          currActiveTabs: this.activeTab,
          currIndex: this.tabIndex,
        })
      );
    });
  },
  created() {
    const sessionTabs = JSON.parse(sessionStorage.getItem("tabsItem"));
    console.log("sessionTabs==", sessionTabs);
    if (sessionTabs.currTabsItem.length != 0) {
      for (let i = 0; i < sessionTabs.currTabsItem.length; i++) {
        this.tabsItem.push({
          meta: {
            title: sessionTabs.currTabsItem[i].title,
          },
          name: sessionTabs.currTabsItem[i].name,
          closable: true,
          ref: sessionTabs.currTabsItem[i].ref,
        });
      }
      for (let j = 0; j < sessionTabs.currTabsPath.length; j++) {
        this.tabsPath.push({
          name: sessionTabs.currTabsPath[j].name,
          path: sessionTabs.currTabsPath[j].path,
        });
      }
      this.activeTab = sessionTabs.currActiveTabs;
      this.tabIndex = sessionTabs.currIndex;
      //避免强制修改url 出现浏览器的url输入框的路径和当前tabs选中的路由路径不匹配
      const activePath = this.tabsPath.filter(
        (item) => item.name == this.activeTab
      );
      this.$router.push({
        path: activePath[0].path,
      });
    }
  },
  watch: {
    $route: function (to) {
      //监听路由的变化，动态生成tabs
      let flag = true; //判断是否需要新增页面
      const path = to.path;
      // eslint-disable-next-line no-empty
      if(path ==='/Index'){
        flag=false;
      }
      if (Object.keys(to.meta).length != 0) {
        for (let i = 0; i < this.$refs.tabs.length; i++) {
          if (i != 0) {
            //首页不判断 如果页面已存在，则直接定位当页面，否则新增tab页面
            if (this.$refs.tabs[i].label == to.meta.title) {
              this.activeTab = this.$refs.tabs[i].name; //定位到已打开页面
              flag = false;
              break;
            }
          }
        }
        if (flag) {
          //获得路由元数据的name和组件名
          const thisName = to.meta.title;
          // const thisComp = to.meta.comp;
          //对tabs的当前激活下标和tabs数量进行自加
          let newActiveIndex = ++this.tabIndex + '';
          //动态双向追加tabs
          this.tabsItem.push({
            name: String(newActiveIndex),
            ref: "tabs",
            closable: true,
            meta: {
              title: thisName,
            },
            // content: thisComp,
          });
          this.activeTab = newActiveIndex;
          if (this.tabsPath.indexOf(path) == -1) {
            this.tabsPath.push({
              name: newActiveIndex,
              path: path,
            });
          }
        }
      }
    },
  },
  methods: {
  
    isActive(path) {
      return path === handleActivePath(this.$route, true);
    },
    removeTab(targetName) {
      //删除Tab
      let tabs = this.tabsItem; //当前显示的tab数组
      let activeName = this.activeTab; //点前活跃的tab

      //如果当前tab正活跃 被删除时执行
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
              this.tabClick(nextTab);
            }
          }
        });
      }
      this.activeTab = activeName;
      this.tabsItem = tabs.filter((tab) => tab.name !== targetName);
      //在tabsPath中删除当前被删除tab的path
      //this.tabsPath = this.tabsPath.filter((item) => item.name !== targetName);
    },
    tabClick(thisTab) {
      /*
       * thisTab:当前选中的tabs的实例
       * 通过当前选中tabs的实例获得当前实例的path 重新定位路由
       * */
      // if (this.isActive(thisTab.name)) {
      //   this.$baseEventBus.$emit("reload-router-view");
      // } else {
      //   this.$router.push(this.tabsItem[thisTab.index]);
      // }
      let val = this.tabsPath.filter((item) => thisTab.name == item.name);
      this.$router.push({
        path: val[0].path,
      });
    },
  },
};
</script>


<style lang="scss" scoped>
.vab-tabs {
  position: relative;
  box-sizing: border-box;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: space-between;
  min-height: 50px;
  padding-right: 20px;
  padding-left: 20px;
  user-select: none;
  background: #fff;
  border-top: 1px solid #f6f6f6;

  ::v-deep {
    .fold-unfold {
      margin-right: 20px;
    }

    [class*="ri"] {
      margin-right: 3px;
    }
  }

  &-content {
    width: calc(100% - 40px);

    &-card {
      height: 34px;

      ::v-deep {
        .el-tabs__nav-next,
        .el-tabs__nav-prev {
          height: 34px;
          line-height: 34px;
        }

        .el-tabs__header {
          border-bottom: 0;

          .el-tabs__nav {
            border: 0;
          }

          .el-tabs__item {
            box-sizing: border-box;
            height: 34px;
            margin-right: 5px;
            line-height: 34px;
            border: 1px solid #dcdfe6;
            border-radius: 2.5px;
            transition: padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) !important;

            &.is-active {
              color: #1890ff;
              background: mix(#fff, #1890ff, 90%);
              border: 1px solid #1890ff;
              outline: none;
            }

            &:hover {
              border: 1px solid #1890ff;
            }
          }
        }
      }
    }
  }
}
</style>
