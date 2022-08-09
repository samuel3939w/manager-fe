<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form ref="form" :inline="true" :model="queryForm">
        <el-form-item label="菜單名稱" prop="menuName">
          <el-input v-model="queryForm.menuName" placeholder="請輸入菜單名稱" />
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
        <el-button type="primary" @click="handleAdd(1)" v-has="'menu-create'"
          >新增</el-button
        >
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
            <el-button
              type="primary"
              @click="handleAdd(2, scope.row)"
              size="small"
              v-has="'menu-create'"
            >
              新增
            </el-button>
            <el-button
              @click="handleEdit(scope.row)"
              size="small"
              v-has="'menu-edit'"
            >
              編輯
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDel(scope.row)"
              v-has="'menu-delete'"
              >刪除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        title="菜單新增"
        v-model="showModal"
        :before-close="handleClose"
      >
        <el-form
          ref="createMenuForm"
          :model="menuForm"
          label-width="100px"
          :rules="rules"
        >
          <el-form-item label="父級菜單" prop="parentId">
            <el-cascader
              v-model="menuForm.parentId"
              :options="menuList"
              :props="{ checkStrictly: true, value: '_id', label: 'menuName' }"
              clearable
            />
            <span>不選, 則直接創建一級菜單</span>
          </el-form-item>
          <el-form-item label="菜單類型" prop="menuType">
            <el-radio-group v-model="menuForm.menuType">
              <el-radio :label="1">菜單</el-radio>
              <el-radio :label="2">按鈕</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="菜單名稱" prop="menuName">
            <el-input
              v-model="menuForm.menuName"
              placeholder="請輸入菜單名稱"
            />
          </el-form-item>
          <el-form-item
            label="菜單圖標"
            prop="icon"
            v-show="menuForm.menuType === 1"
          >
            <el-input v-model="menuForm.icon" placeholder="請輸入菜單圖標" />
          </el-form-item>
          <el-form-item
            label="路由地址"
            prop="path"
            v-show="menuForm.menuType === 1"
          >
            <el-input v-model="menuForm.path" placeholder="請輸入路由地址" />
          </el-form-item>
          <el-form-item
            label="權限標示"
            prop="menuCode"
            v-show="menuForm.menuType === 2"
          >
            <el-input
              v-model="menuForm.menuCode"
              placeholder="請輸入權限標示"
            />
          </el-form-item>
          <el-form-item
            label="組件路徑"
            prop="component"
            v-show="menuForm.menuType === 1"
          >
            <el-input
              v-model="menuForm.component"
              placeholder="請輸入組件路徑"
            />
          </el-form-item>
          <el-form-item
            label="菜單狀態"
            prop="menuState"
            v-show="menuForm.menuType === 1"
          >
            <el-radio-group v-model="menuForm.menuState">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">停用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit">確定</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from "element-plus";
import { nextTick, onMounted, ref } from "vue";
import { menuListApi, menuSubmitApi } from "../api";
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
    width: 90,
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
    width: 150,
    formatter(row, column, value) {
      return formateDate(new Date(value));
    },
  },
];
const menuForm = ref({
  parentId: [null],
  menuType: 1,
  menuState: 1,
});
const showModal = ref(false);
let action = ref("");
const rules = {
  menuName: [
    {
      required: true,
      message: "請輸入菜單名稱",
      trigger: "blur",
    },
    {
      min: 2,
      max: 10,
      message: "長度在2-10之間",
      trigger: "blur",
    },
  ],
};

onMounted(() => {
  getMenuList();
});
// 獲取菜單列表
const getMenuList = async () => {
  const list = await menuListApi(queryForm.value);
  menuList.value = list;
};

const handleQuery = () => {
  getMenuList();
};

const form = ref(null);

// 表單重置
const handleReset = () => {
  form.value.resetFields();
};
// 新增菜單
const handleAdd = (type, row) => {
  showModal.value = true;
  action.value = "add";
  if (type == 2) {
    menuForm.value.parentId = [...row.parentId, row._id].filter((item) => item);
  }
};

const handleEdit = (row) => {
  showModal.value = true;
  action.value = "edit";
  nextTick(() => {
    Object.assign(menuForm.value, row);
  });
};
const handleDel = async ({ _id }) => {
  await menuSubmitApi({ _id, action: "delete" });
  ElMessage.success("刪除成功");
  getMenuList();
};

const handleResetMenuForm = () => {
  createMenuForm.value.resetFields();
};

// 創建菜單列表
const createMenuForm = ref(null);
const handleSubmit = () => {
  createMenuForm.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    const params = { ...menuForm.value, action: action.value };
    await menuSubmitApi(params);
    showModal.value = false;
    ElMessage.success("操作成功");
    handleResetMenuForm();
    getMenuList();
  });
};

// 彈框關閉
const handleClose = () => {
  showModal.value = false;
  handleResetMenuForm();
};
</script>
<style scoped lang='scss'>
</style>
