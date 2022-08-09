<template>
  <div class="dept-manage">
    <div class="query-form">
      <el-form inline ref="queryForm" :model="queryForm">
        <el-form-item prop="deptName">
          <el-input v-model="queryForm.deptName" placeholder="請輸入部門名稱" />
        </el-form-item>
        <el-form-item>
          <el-button @click="getDeptList" type="primary">查詢</el-button>
          <el-button @click="handleReset('queryForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleOpen" v-has="'dept-create'"
          >創建</el-button
        >
      </div>
      <el-table
        :data="deptList"
        row-key="_id"
        :tree-props="{ children: 'children' }"
        stripe
      >
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          v-bind="item"
        ></el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              @click="handleEdit(scope.row)"
              v-has="'dept-edit'"
            >
              編輯
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleDel(scope.row._id)"
              v-has="'dept-delete'"
            >
              刪除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :title="action == 'create' ? '創建部門' : '編輯部門'"
      v-model="showModel"
      :before-close="handleClose"
    >
      <el-form
        ref="dialogForm"
        :model="deptForm"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="上級部門" prop="parentId">
          <el-cascader
            placeholder="請選擇上級部門"
            v-model="deptForm.parentId"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
            clearable
            :options="deptList"
            :show-all-levels="true"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="部門名稱" prop="deptName">
          <el-input placeholder="請輸入部門名稱" v-model="deptForm.deptName" />
        </el-form-item>
        <el-form-item label="負責人" prop="user">
          <el-select
            placeholder="請選擇負責人"
            v-model="deptForm.user"
            @change="handleUser"
          >
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.userName"
              :value="`${item.userId}/${item.userName}/${item.userEmail}`"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="負責人信箱" prop="userEmail">
          <el-input
            placeholder="請輸入負責人信箱"
            v-model="deptForm.userEmail"
            disabled
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button @click="handleSubmit" type="primary">確定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { allUserListApi, deptListApi, deptOperateApi } from "../api";
import {formateDate} from './../utils/utils'
export default {
  name: "dept",
  data() {
    return {
      queryForm: {
        deptName: "",
      },
      columns: [
        {
          label: "部門名稱",
          prop: "deptName",
        },
        {
          label: "負責人",
          prop: "userName",
        },
        {
          label: "更新時間",
          prop: "updateTime",
          formatter(row, column, value) {
            if (!value) {
              return;
            }
            return formateDate(new Date(value));
          },
        },
        {
          label: "創建時間",
          prop: "createTime",
          formatter(row, column, value) {
            if (!value) {
              return;
            }
            return formateDate(new Date(value));
          },
        },
      ],
      deptList: [],
      pager: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
      },
      action: "create",
      showModel: false,
      userList: [],
      deptForm: { parentId: [null] },
      rules: {
        parentId: [
          {
            required: true,
            message: "請選擇上級部門",
            trigger: "blur",
          },
        ],
        deptName: [
          {
            required: true,
            message: "請輸入部門名稱",
            trigger: "blur",
          },
        ],
        user: [
          {
            required: true,
            message: "請選擇負責人",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    this.getDeptList();
    this.getUserList();
  },
  methods: {
    async getUserList() {
      this.userList = await allUserListApi();
    },
    async getDeptList() {
      let list = await deptListApi({ ...this.queryForm, ...this.pager });
      this.deptList = list;
    },
    handleReset(form) {
      this.$refs[form].resetFields();
    },
    handleOpen() {
      this.action = "create";
      this.showModel = true;
    },
    handleEdit(row) {
      this.action = "edit";
      this.showModel = true;
      this.$nextTick(() => {
        Object.assign(this.deptForm, row, {
          user: `${row.userId}/${row.userName}/${row.userEmail}`,
        });
      });
    },
    async handleDel(_id) {
      this.action = "delete";
      await deptOperateApi({ _id, action: this.action });
      this.$message.success("刪除成功");
      this.getDeptList();
    },
    handleClose() {
      this.showModel = false;
      this.handleReset("dialogForm");
    },
    handleSubmit() {
      this.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          const params = { action: this.action, ...this.deptForm };
          delete params.user;
          await deptOperateApi(params);
          this.$message.success("操作成功");
          this.handleClose();
          this.getDeptList();
        }
      });
    },
    handleUser(val) {
      const [userId, userName, userEmail] = val.split("/");
      Object.assign(this.deptForm, { userId, userName, userEmail });
    },
  },
};
</script>

<style>
</style>