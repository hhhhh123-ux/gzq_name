<template>
  <div>
    <el-dialog
        :append-to-body="true"
        title="生成代码"
        top="5vh"
        :visible.sync="dialogFormVisible"
        width="880px"
        @close="close"
    >
      <el-scrollbar style="height: 200px">
        <el-form
            ref="form"
            :label-position="'right'"
            label-width="80px"
            :model="form"
            :rules="rules"
        >
          <el-form-item label="评论" prop="remarks">
            <el-input
                v-model="form.remarks"
                auto-complete="off"
                style="width: 30%"
            />
          </el-form-item>
          <el-form-item label="表名" prop="tableName">
            <el-input
                v-model="form.tableName"
                auto-complete="off"
                style="width: 30%"
            />
          </el-form-item>
          <el-form-item label="包名" prop="packageName">
            <el-input
                v-model="form.path"
                auto-complete="off"
                style="width: 30%"
            />
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <template #footer>
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>


<script>
import {generator} from "@/api/system/gen/gen";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'add',
  data() {
    return {
      transferRecord: [],
      activities: [],
      stripe: false,
      border: true,
      listLoading: false,
      dialogFormVisible: false,
      form: {
        path:''
      },
      rowDetail: {},
      lineHeight: 'small',
      pageQuery: {totalRows: 0, pageSize: 10, currentPage: 1, dqo: {}},
      pageQuerys: {totalRows: 0, pageSize: 10, currentPage: 1, dqo: {}},
      genColumns: [
        {
          label: '表名',
          width: 'auto',
          prop: 'tableName',
        },
        {
          label: '评论',
          width: 'auto',
          prop: 'remarks',
        },
      ],
    }
  },

  methods: {
    async showEdit(row) {
      this.listLoading = true
      this.form.remarks = row.remarks;
      this.form.tableName = row.tableName;
      this.dialogFormVisible = true
    },
    handleSizeChange(val) {
      this.pageQuery.pageSize = val
      this.pageQuery.currentPage = 1
      this.getData()
    },
    handleCurrentChange(val) {
      this.pageQuery.currentPage = val
      this.getData()
    },
    handleSizeChanges(val) {
      this.pageQuerys.pageSize = val
      this.pageQuerys.currentPage = 1
      this.getData()
    },
    handleCurrentChanges(val) {
      this.pageQuerys.currentPage = val
      this.getData()
    },
    save() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          //新增信息
          const { msg } = await generator(this.form)
          this.$message({
            type:"success",
            message:msg
          })
          this.$emit('fetch-data')
          this.close()
        }
      })
    },
    close() {
      this.dialogFormVisible = false
    },
  },
}
</script>
