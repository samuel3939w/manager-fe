<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form ref="form" :inline="true" :model="queryForm">
        <el-form-item label="菜單名稱" prop="menuName">
          <el-input v-model="queryForm.menuName" placeholder="請輸入用戶ID" />
        </el-form-item>
        <el-form-item label="菜單狀態" prop="menuState">
          <el-select v-model="queryForm.menuState">
            <el-option :value="1" label="正常"></el-option>
            <el-option :value="2" label="停用"></el-option>
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
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </div>
      <el-table :row-style="{ height: '50px' }" :data="menuList" row-key="_id">
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :label="item.label"
          :prop="item.prop"
          :width="item.width"
          :formatter="item.formatter"
        >
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button @click="handleAdd(scope.row)" size="small">
              新增
            </el-button>
            <el-button @click="handleEdit(scope.row)" size="small">
              編輯
            </el-button>
            <el-button type="danger" size="small" @click="handleDel(scope.row)"
              >刪除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-dialog
        title="用戶新增"
        v-model="showModal"
        :before-close="handleClose"
      >
        <el-form
          ref="createUserForm"
          :model="userForm"
          label-width="100px"
          :rules="rules"
        >
          <el-form-item label="用戶名" prop="userName">
            <el-input
              :disabled="action == 'edit'"
              v-model="userForm.userName"
              placeholder="請輸入用戶名稱"
            />
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
      </el-dialog> -->
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from "element-plus";
import { onMounted, ref } from "vue";
import { menuListApi } from "../api";
import { formateDate } from "@/utils/utils";

const queryForm = ref({ menuState: 1 });
const menuList = ref([]);
const columns = [
  {
    label: "菜單名稱",
    prop: "menuName",
    width: 150,
  },
  {
    label: "圖標",
    prop: "icon",
  },
  {
    label: "菜單類型",
    prop: "menuType",
    formatter(row, column, value) {
      return {
        1: "菜單",
        2: "按鈕",
      }[value];
    },
  },
  {
    label: "權限標示",
    prop: "menuCode",
  },
  {
    label: "路由地址",
    prop: "path",
  },
  {
    label: "組件路徑",
    prop: "component",
  },
  {
    label: "菜單狀態",
    prop: "menuState",
    width:90,
    formatter(row, column, value) {
      return {
        1: "正常",
        2: "停用",
      }[value];
    },
  },
  {
    label: "創建時間",
    prop: "createTime",
    width:150,
    formatter(row, column, value) {
      return formateDate(new Date(value));
    },
  },
];

onMounted(() => {
  getMenuList();
});

const getMenuList = async () => {
  const list = await menuListApi(queryForm.value);
  menuList.value = list;
};

const handleQuery = () => {};
const handleReset = () => {};
const handleAdd = () => {};
const handleEdit = () => {};
const handleDel = () => {};
</script>
<style scoped lang='scss'>
</style>
