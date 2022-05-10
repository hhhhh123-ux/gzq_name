<template>
  <div ref="custom-table"
       class="custom-table-container"
       :class="{ 'vab-fullscreen': isFullscreen }"
  >
    <vab-query-form>
      <vab-query-form-left-panel :span="24">
        <el-form :inline="true" label-width="80px" @submit.native.prevent>
          <el-form-item label="表名">
            <el-input
                v-model="data.tableName"
                clearable
                placeholder="请输入表名"
            />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="queryData">
              查询
            </el-button>
            <el-button icon="el-icon-refresh" @click="clear">重置</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="24">
        <div class="stripe-panel">
          <el-checkbox v-model="stripe">斑马纹</el-checkbox>
        </div>
        <div class="border-panel">
          <el-checkbox v-model="border">边框（可拉伸列）</el-checkbox>
        </div>
        <el-button
            style="margin: 0 10px 10px 0 !important"
            type="primary"
            @click="clickFullScreen"
        >
          <vab-icon
              :icon="isFullscreen ? 'fullscreen-exit-fill' : 'fullscreen-fill'"
          />
          表格全屏
        </el-button>
        <el-popover
            ref="popover"
            popper-class="custom-table-checkbox"
            trigger="hover"
        >
          <el-radio-group v-model="lineHeight">
            <el-radio label="medium">大</el-radio>
            <el-radio label="small">中</el-radio>
            <el-radio label="mini">小</el-radio>
          </el-radio-group>
          <template #reference>
            <el-button style="margin: 0 10px 10px 0 !important" type="primary">
              <vab-icon icon="line-height"/>
              表格尺寸
            </el-button>
          </template>
        </el-popover>
<!--        <el-popover popper-class="custom-table-checkbox" trigger="hover">-->
<!--          <el-checkbox-group v-model="checkList">-->
<!--            <vab-draggable v-bind="dragOptions" :list="columns">-->
<!--              <div v-for="(item, index) in columns" :key="item + index">-->
<!--                <vab-icon icon="drag-drop-line"/>-->
<!--                <el-checkbox-->
<!--                    :disabled="item.disableCheck === true"-->
<!--                    :label="item.label"-->
<!--                >-->
<!--                  {{ item.label }}-->
<!--                </el-checkbox>-->
<!--              </div>-->
<!--            </vab-draggable>-->
<!--          </el-checkbox-group>-->
<!--          <template #reference>-->
<!--            <el-button-->
<!--                icon="el-icon-setting"-->
<!--                style="margin: 0 0 10px 0 !important"-->
<!--                type="primary"-->
<!--            >-->
<!--              列设置-->
<!--            </el-button>-->
<!--          </template>-->
<!--        </el-popover>-->
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table
        v-loading="listLoading"
        :border="border"
        @selection-change="setSelectRows"
        :data="tableData"
        :height="250"
        style="width: 100%"
        :stripe="stripe"
        :size="lineHeight"
    >
      <el-table-column align="center" type="selection" width="55"/>
      <el-table-column
          align="center"
          prop="remarks"
          label="评论"
          width="180"
      >
      </el-table-column>
      <el-table-column align="center" prop="tableName" label="表名" width="180">
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间">
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="allAdd(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
        background
        align="center"
        :current-page.sync="data.currentPage"
        layout="total, sizes, prev, pager, next, jumper"
        :page-size="data.pageSize"
        :page-sizes="[10, 20, 30, 50]"
        :total="data.totalRows"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
    />
    <add ref="add" :all-roles="allRoles" @fetch-data="getData" />
  </div>

</template>
<script>
import Add from "./Components/add";
import {allList} from "@/api/system/gen/gen";
export default {
  components: {
    // eslint-disable-next-line vue/no-unused-components
      Add,
  },
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Gen",
  data() {
    return {
      stripe: false,
      lineHeight: 'small',
      isFullscreen: false,
      tableData: [],
      height:'250',
      allRoles: [],
      data: {
        tableName: "",
        currentPage: 1,
        pageSize: 10,
        totalRows: 0,
      },
      listLoading: true,
      border: true,
    };
  },
  created() {
    this.getData();
  },
  methods: {
    clickFullScreen() {
      this.isFullscreen = !this.isFullscreen
      this.handleHeight()
    },

    handleHeight() {
      if (this.isFullscreen) this.height = this.$baseTableHeight(1) + 210
      else this.height = this.$baseTableHeight(1)
    },
    // 搜索
    queryData() {
      this.getData()
    },
    clear() {
      this.tableName = ''
      this.getData()
    },
    getData() {
      const data = JSON.parse(JSON.stringify(this.data));
      this.listLoading = true;
      allList(data).then((response) => {
        console.log(response);
        if (response.code == '200') {
          this.tableData = response.data.content;
          this.data.totalRows = response.data.totalElements;
          this.listLoading = false;
        } else if (response.code == '403') {
          this.$message.error("无权限")
        }
      });
    },
    handleSizeChange(val) {
      this.data.pageSize = val;
      this.getData();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.data.currentPage = val;
      this.getData();
      console.log(`当前页: ${val}`);
    },
    setSelectRows(val) {
      this.selectRows = val;
    },
    allAdd(row) {
      console.log("row",row);
      this.$refs['add'].showEdit(row)
    },
  },
};
</script>
//
// .custom-table-container {
//     ::v-deep {
//       i {
//         cursor: pointer;
//       }
//       .stripe-panel,
//     .border-panel {
//       margin: 0 10px 10px !important;
//     }
//     }

// .iframe-container {
//   iframe {
//     width: 100%;
//     height: 100vh;
//   }
// }
