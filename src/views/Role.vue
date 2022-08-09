<template>
  <div class="role-manage">
    <div class="query-form">
      <el-form ref="form" :inline="true" :model="queryForm">
        <el-form-item label="角色名稱" prop="roleName">
          <el-input v-model="queryForm.roleName" placeholder="請輸入角色名稱" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查詢</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd" v-has="'role-create'"
          >創建</el-button
        >
      </div>
      <el-table :row-style="{ height: '50px' }" :data="roleList" row-key="_id">
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :label="item.label"
          :prop="item.prop"
          :width="item.width"
          :formatter="item.formatter"
        >
        </el-table-column>
        <el-table-column label="操作" width="260">
          <template #default="scope">
            <el-button
              size="small"
              @click="handleEdit(scope.row)"
              v-has="'role-edit'"
            >
              編輯
            </el-button>
            <el-button
              size="small"
              type="primary"
              @click="handleOpenPermission(scope.row)"
              v-has="'role-setting'"
            >
              設置權限
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDel(scope.row)"
              v-has="'role-delete'"
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
      <el-dialog
        title="角色新增"
        v-model="showModal"
        :before-close="handleClose"
      >
        <el-form
          ref="createRoleForm"
          :model="roleForm"
          label-width="100px"
          :rules="rules"
        >
          <el-form-item label="角色名稱" prop="roleName">
            <el-input
              v-model="roleForm.roleName"
              placeholder="請輸入角色名稱"
            />
          </el-form-item>
          <el-form-item label="備註" prop="remark">
            <el-input
              type="textarea"
              :rows="2"
              v-model="roleForm.remark"
              placeholder="請輸入備註"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit">確定</el-button>
        </template>
      </el-dialog>
      <!-- 權限彈框 -->
      <el-dialog
        title="角色新增"
        v-model="showPermission"
        :before-close="handlePermissionClose"
      >
        <el-form label-width="100px">
          <el-form-item label="角色名稱">
            {{ curRoleName }}
          </el-form-item>
          <el-form-item label="選擇權限">
            <el-tree
              ref="permissionTree"
              :data="menuList"
              show-checkbox
              node-key="_id"
              :props="{ label: 'menuName' }"
              default-expand-all
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="handlePermissionClose">取消</el-button>
          <el-button type="primary" @click="handlePermissionSubmit"
            >確定</el-button
          >
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from "element-plus";
import { nextTick, onMounted, ref } from "vue";
import {
  menuListApi,
  roleListApi,
  roleOperateApi,
  updatePermissionApi,
} from "../api";
import { formateDate } from "@/utils/utils";

const queryForm = ref({ roleName: "" });
const roleList = ref([]);
const menuList = ref([]);
const pager = ref({
  pageNum: 1,
  total: 0,
  pageSize: 10,
});
const columns = [
  {
    label: "角色名稱",
    prop: "roleName",
    width: 150,
  },
  {
    label: "備註",
    prop: "remark",
  },
  {
    label: "權限列表",
    prop: "permissionList",
    width: 200,
    formatter(row, column, value) {
      const names = [];
      const list = value.halfCheckedKeys || [];
      list.map((key) => {
        if (actionMap.value[key]) names.push(actionMap.value[key]);
      });
      return names.join(",");
    },
  },
  {
    label: "更新時間",
    prop: "updateTime",
    width: 150,
    formatter(row, column, value) {
      return formateDate(new Date(value));
    },
  },
  {
    label: "創建時間",
    prop: "createTime",
    width: 150,
    formatter(row, column, value) {
      return formateDate(new Date(value));
    },
  },
];
const showModal = ref(false);
const rules = {
  roleName: [
    {
      required: true,
      message: "請輸入角色名稱",
    },
  ],
};

onMounted(() => {
  getRoleList();
  getMenuList();
});

// 分頁變更函數
const handleCurrentChange = (current) => {
  pager.value.pageNum = current;
  getRoleList();
};

// 用戶列表初始化
const getRoleList = async () => {
  const { list, page } = await roleListApi({
    ...queryForm.value,
    ...pager.value,
  });
  roleList.value = list;
  pager.value.total = page.total;
};

const handleQuery = () => {
  getRoleList();
};

const form = ref(null);

// 表單重置
const handleReset = () => {
  form.value.resetFields();
};

const action = ref("create");
const roleForm = ref({});
// 角色添加
const handleAdd = () => {
  action.value = "create";
  showModal.value = true;
};

//角色編輯
const handleEdit = (row) => {
  action.value = "edit";
  showModal.value = true;
  nextTick(() => {
    Object.assign(roleForm.value, {
      _id: row._id,
      roleName: row.roleName,
      remark: row.remark,
    });
  });
};

// 角色刪除
const handleDel = async ({ _id }) => {
  await roleOperateApi({ _id, action: "delete" });
  ElMessage.success("刪除成功");
  getRoleList();
};

const createRoleForm = ref(null);
const handleRoleFormReset = () => {
  createRoleForm.value.resetFields();
};

// 彈框關閉
const handleClose = () => {
  showModal.value = false;
  handleRoleFormReset();
};

// 角色提交
const handleSubmit = () => {
  createRoleForm.value.validate(async (valid) => {
    if (valid) {
      const params = { ...roleForm.value, action: action.value };
      const res = await roleOperateApi(params);
      if (res) {
        showModal.value = false;
        ElMessage.success("創建成功");
        handleRoleFormReset();
        getRoleList();
      }
    }
  });
};

const showPermission = ref(false);
const curRoleName = ref("");
const curRoleId = ref("");
const permissionTree = ref(null);

// 菜單列表初始化
const getMenuList = async () => {
  try {
    const list = await menuListApi();
    menuList.value = list;
    getActionoMap(list);
  } catch (e) {
    throw new Error(e);
  }
};

// 菜單映射表
const actionMap = ref({});

const getActionoMap = (list) => {
  let actionMapTemp = {};
  const deep = (arr) => {
    arr.forEach((item) => {
      if (item.children && item.action) {
        actionMapTemp[item._id] = item.menuName;
      }
      if (item.children && !item.action) {
        deep(item.children);
      }
    });
    // while (arr.length) {
    //   const item = arr.pop();
    //   if (item.children && item.action) {
    //     actionMapTemp[item._id] = item.menuName;
    //   }
    //   if (item.children && !item.action) {
    //     deep(item.children);
    //   }
    // }
  };
  deep(JSON.parse(JSON.stringify(list)));
  actionMap.value = actionMapTemp;
};

const handleOpenPermission = (row) => {
  curRoleId.value = row._id;
  curRoleName.value = row.roleName;
  showPermission.value = true;
  const { checkedKeys } = row.permissionList;
  setTimeout(() => {
    permissionTree.value.setCheckedKeys(checkedKeys);
  });
};

const handlePermissionSubmit = async () => {
  const nodes = permissionTree.value.getCheckedNodes();
  const halfKeys = permissionTree.value.getHalfCheckedKeys();
  const checkedKeys = [];
  const parentKeys = [];
  nodes.map((node) => {
    if (!node.children) {
      checkedKeys.push(node._id);
    } else {
      parentKeys.push(node._id);
    }
  });

  const params = {
    _id: curRoleId.value,
    permissionList: {
      checkedKeys,
      halfCheckedKeys: parentKeys.concat(halfKeys),
    },
  };
  await updatePermissionApi(params);
  showPermission.value = false;
  ElMessage.success("設置成功");
  getRoleList();
};

const handlePermissionClose = () => {
  showPermission.value = false;
};
</script>
<style scoped lang='scss'>
</style>
