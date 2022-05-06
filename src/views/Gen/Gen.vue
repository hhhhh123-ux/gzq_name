<template>
  <div ref="custom-table" class="custom-table-container">
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
    </vab-query-form>
    <el-table
      v-loading="listLoading"
      :border="border"
      @selection-change="setSelectRows"
      :data="tableData"
      height="250"
      style="width: 100%"
    >
      <el-table-column align="center" type="selection" width="55" />
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
          <el-button size="mini" @click="allAdd(scope.row)">生成代码</el-button>
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
  </div>
</template>
<script>
import { allList } from "@/api/system/gen/gen";
export default {
  components: {},
  name: "Gen",
  data() {
    return {
      tableData: [],
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
        this.tableData = response.data.content;
        this.data.totalRows = response.data.totalElements;
        this.listLoading = false;
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
    allAdd(){
      
    }
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
