<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form ref="form" :inline="true" :model="user">
        <el-form-item label="用戶ID" prop="userId">
          <el-input v-model="user.userId" placeholder="請輸入用戶ID" />
        </el-form-item>
        <el-form-item label="用戶姓名" prop="userName">
          <el-input v-model="user.userName" placeholder="請輸入用戶名稱" />
        </el-form-item>
        <el-form-item label="狀態" prop="state">
          <el-select v-model="user.state">
            <el-option :value="0" label="所有"></el-option>
            <el-option :value="1" label="在職"></el-option>
            <el-option :value="2" label="離職"></el-option>
            <el-option :value="3" label="試用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查詢</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleCreate" v-has="'user-create'"
          >新增</el-button
        >
        <el-button
          type="danger"
          @click="handlePatchDel"
          v-has="'user-patch-delete'"
          >批量刪除</el-button
        >
      </div>
      <el-table
        :row-style="{ height: '50px' }"
        :data="userList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :label="item.label"
          :prop="item.prop"
          :width="item.width"
          :formatter="item.formatter"
        >
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button
              @click="handleEdit(scope.row)"
              size="small"
              v-has="'user-edit'"
            >
              編輯
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDel(scope.row)"
              v-has="'user-delete'"
              >刪除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        layout="prev,pager,next"
        :total="pager.total"
        :page-size="pager.pageSize"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog title="用戶新增" v-model="showModal" :before-close="handleClose">
      <el-form
        ref="createUserForm"
        :model="userForm"
        label-width="100px"
        :rules="rules"
      >
        <el-form-item label="用戶ID" prop="userId">
          <el-input :disabled="action==='edit'" v-model="userForm.userId" placeholder="請輸入用戶ID" />
        </el-form-item>
        <el-form-item label="用戶名" prop="userName">
          <el-input v-model="userForm.userName" placeholder="請輸入用戶名稱" />
        </el-form-item>
        <el-form-item label="信箱" prop="userEmail">
          <el-input v-model="userForm.userEmail" placeholder="請輸入用戶信箱">
            <template #append>@pro-partner.com.tw</template>
          </el-input>
        </el-form-item>
        <el-form-item label="手機號碼" prop="mobile">
          <el-input v-model="userForm.mobile" placeholder="請輸入手機號碼" />
        </el-form-item>
        <el-form-item label="職稱" prop="job">
          <el-input v-model="userForm.job" placeholder="請輸入職稱" />
        </el-form-item>
        <el-form-item label="狀態" prop="state">
          <el-select v-model="userForm.state">
            <el-option :value="1" label="在職"></el-option>
            <el-option :value="2" label="離職"></el-option>
            <el-option :value="3" label="試用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系統角色" prop="roleList">
          <el-select
            v-model="userForm.roleList"
            placeholder="請選擇用戶系統角色"
            multiple
            style="width: 100%"
          >
            <el-option
              v-for="role in roleList"
              :key="role._id"
              :label="role.roleName"
              :value="role._id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部門" prop="deptId">
          <el-cascader
            v-model="userForm.deptId"
            placeholder="請選擇所屬部門"
            :options="deptList"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
            clearable
            style="width: 100%"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit">確定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ElMessage } from "element-plus";
import { nextTick, onMounted, ref, toRaw } from "vue";
import {
  deptListApi,
  roleAllListApi,
  userDelApi,
  userListApi,
  userSubmitApi,
} from "../api";
import { formateDate } from "./../utils/utils.js";

const user = ref({
  userId: "",
  userName: "",
  state: 1,
});
const userList = ref([]);
const pager = ref({
  total: 0,
  pageNum: 1,
  pageSize: 10,
});
// 定義動態表格-格式
const columns = ref([
  {
    label: "用戶ID",
    prop: "userId",
  },
  {
    label: "用戶名",
    prop: "userName",
  },
  {
    label: "用戶信箱",
    prop: "userEmail",
    width: 170,
    formatter(row, column, value) {
      return `${value}@pro-partner.com.tw`;
    },
  },
  {
    label: "用戶角色",
    prop: "role",
    formatter(row, column, value) {
      return {
        0: "管理員",
        1: "普通用戶",
      }[value];
    },
  },
  {
    label: "用戶狀態",
    prop: "state",
    formatter(row, column, value) {
      return {
        1: "在職",
        2: "離職",
        3: "試用期",
      }[value];
    },
  },
  {
    label: "註冊時間",
    prop: "createTime",
    width: 185,
    formatter(row, column, value) {
      if (!value) {
        return;
      }
      return formateDate(new Date(value));
    },
  },
  {
    label: "最後登入時間",
    prop: "lastLoginTime",
    width: 185,
    formatter(row, column, value) {
      if (!value) {
        return;
      }
      return formateDate(new Date(value));
    },
  },
]);

// 查詢用戶列表
const getUserList = async () => {
  try {
    let params = { ...user.value, ...pager.value };
    const { list, page } = await userListApi(params);
    list.forEach((item) => {
      item.userEmail = item.userEmail.split("@")[0];
    });
    userList.value = list;
    pager.value.total = page.total;
  } catch (error) {
    ElMessage.error("獲取用戶列表失敗", error);
  }
};

// 查詢事件, 獲取用戶列表
const handleQuery = () => {
  getUserList();
};

const form = ref(null);

// 重置查詢表單
const handleReset = () => {
  form.value.resetFields();
};

// 分頁事件處理
const handleCurrentChange = (current) => {
  pager.value.pageNum = current;
  getUserList();
};
onMounted(() => {
  getUserList();
  getDeptList();
  getRoleAllList();
});

// 用戶單個刪除
const handleDel = async (row) => {
  const res = await userDelApi({
    userIds: [row.userId],
  });
  ElMessage.success("刪除成功");
  getUserList();
};

// 選中用戶列表對象
const checkedUserIds = ref([]);

// 批量刪除
const handlePatchDel = async () => {
  if (checkedUserIds.value.length == 0) {
    ElMessage.error("請選擇要刪除的用戶");
    return;
  }
  const res = await userDelApi({
    userIds: checkedUserIds.value,
  });
  if (res.modifiedCount > 0) {
    ElMessage.success("刪除成功");
    getUserList();
  } else {
    ElMessage.error("刪除失敗");
  }
};

// 表格多選
const handleSelectionChange = (list) => {
  const arr = [];
  list.map((item) => {
    arr.push(item.userId);
  });
  checkedUserIds.value = arr;
};

// 彈框是否顯示
const showModal = ref(false);

// 新增用戶Form對象
const userForm = ref({
  state: 1,
});

// 定義表單驗證規則
const rules = {
  userId: [
    {
      required: true,
      message: "請輸入用戶ID",
      trigger: "blur",
    },
  ],
  userName: [
    {
      required: true,
      message: "請輸入用戶姓名",
      trigger: "blur",
    },
  ],
  userEmail: [
    {
      required: true,
      message: "請輸入用戶信箱",
      trigger: "blur",
    },
  ],
  mobile: [
    {
      pattern: /09\d{8}/,
      message: "請輸入正確的手機號碼格式",
      trigger: "blur",
    },
  ],
  deptId: [
    {
      required: true,
      message: "請選擇所屬部門",
      trigger: "blur",
    },
  ],
};

// 用戶新增
const handleCreate = () => {
  action.value = "add";
  showModal.value = true;
};

// 所有部門列表
const deptList = ref([]);

// 部門列表查詢
const getDeptList = async () => {
  const list = await deptListApi();
  deptList.value = list;
};
// 所有角色列表
const roleList = ref([]);

// 角色列表查詢
const getRoleAllList = async () => {
  const list = await roleAllListApi();
  roleList.value = list;
};

// 用戶列表ref
const createUserForm = ref(null);

// 定義用戶操作行為
const action = ref("add");

// 重置新增用戶表單
const handleResetUserForm = () => {
  createUserForm.value.resetFields();
};

// 用戶彈窗關閉
const handleClose = () => {
  showModal.value = false;
  handleResetUserForm();
};

// 用戶提交
const handleSubmit = () => {
  createUserForm.value.validate(async (valid) => {
    if (valid) {
      const params = await toRaw(userForm.value);
      params.userEmail += "@pro-partner.com.tw";
      params.action = action.value;
      const res = await userSubmitApi(params);
      if (res) {
        showModal.value = false;
        if (action.value == "edit") {
          ElMessage.success("用戶編輯成功");
        } else {
          ElMessage.success("用戶創建成功");
        }
        handleResetUserForm();
        getUserList();
      }
    }
  });
};

// 用戶編輯
const handleEdit = (row) => {
  action.value = "edit";
  showModal.value = true;
  nextTick(() => {
    Object.assign(userForm.value, row);
  });
};
</script>
<style scoped lang='scss'>
</style>
