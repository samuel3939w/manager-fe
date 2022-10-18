<template>
  <div class="leave-manage">
    <div class="query-form">
      <el-form ref="form" :inline="true" :model="queryForm">
        <el-form-item label="審批狀態" prop="applyState">
          <el-select v-model="queryForm.applyState">
            <el-option value="" label="全部"></el-option>
            <el-option :value="1" label="待審核"></el-option>
            <el-option :value="2" label="審核中"></el-option>
            <el-option :value="3" label="審核拒絕"></el-option>
            <el-option :value="4" label="審核通過"></el-option>
            <el-option :value="5" label="作廢"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getApplyList">查詢</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleApply">申請</el-button>
      </div>
      <el-table :data="applyList">
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        >
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="small" @click="handleDetail(scope.row)"
              >查看</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(scope.row._id)"
              v-if="[1, 2].includes(scope.row.applyState)"
              >作廢</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next"
        :total="pager.total"
        :page-size="pager.pageSize"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog
      title="申請系統機能增修"
      v-model="showModal"
      width="70%"
      :before-close="handleClose"
    >
      <el-form
        ref="dialogForm"
        :model="systemForm"
        label-width="120px"
        :rules="rules"
      >
        <el-form-item label="資訊負責人" prop="evaluatePerson">
          <el-select
            placeholder="請選擇負責人"
            v-model="systemForm.evaluatePerson"
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
        <el-form-item label="緊急程度" prop="urgentLevel">
          <el-radio-group v-model="systemForm.urgentLevel">
            <el-radio label="一般" value="一般" />
            <el-radio label="急迫" value="急迫" />
            <el-radio label="優先處理" value="優先處理" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="需求類別" prop="type">
          <el-radio-group v-model="systemForm.type">
            <el-radio label="現行系統功能增修" value="現行系統功能增修" />
            <el-radio
              label="現行系統資料異動調整"
              value="現行系統資料異動調整"
            />
            <el-radio label="新系統規劃設計" value="新系統規劃設計" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="需求說明" prop="reasons" required>
          <el-input
            type="textarea"
            :row="3"
            placeholder="請輸入需求說明"
            v-model="systemForm.reasons"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit">確定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      title="申請詳情"
      width="50%"
      v-model="showDetailModel"
      destroy-on-close
    >
      <el-steps
        :active="detail.applyState > 2 ? 3 : detail.applyState"
        align-center
      >
        <el-step title="待審核"></el-step>
        <el-step title="審核中"></el-step>
        <el-step title="審核通過/審核拒絕"></el-step>
      </el-steps>
      <el-form label-width="120px" label-suffix=":">
        <el-form-item label="申請單位">
          <div>{{ detail.deptName }}</div>
        </el-form-item>
        <el-form-item label="申請人">
          <div>{{ detail.applyUser.userName }}</div>
        </el-form-item>
        <el-form-item label="需求評估人">
          <div>{{ detail.evaluatePersonName }}</div>
        </el-form-item>
        <el-form-item label="當前審核人">
          <div>{{ detail.curAuditUserName }}</div>
        </el-form-item>
        <el-form-item label="資訊評估結果">
          <div>{{ detail.evaluateResult }}</div>
        </el-form-item>
        <el-form-item label="評估說明">
          <div>{{ detail.evaluateInstruction }}</div>
        </el-form-item>
        <el-form-item label="工時">
          <div>
            <span>{{ detail.workhours }}/h</span>
            <span>({{ detail.workhours * 2000 }}元)</span>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { ElMessage } from "element-plus";
import { ref, reactive, onMounted } from "vue";
import {
  systemListApi,
  systemOperateApi,
  ItUserListApi,
} from "../api";
import { formateDate } from "../utils/utils";

const queryForm = reactive({
  applyState: 1,
});
const pager = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});

// 申請列表
const applyList = ref([]);

// 定義動態表格-格式
const columns = reactive([
  {
    label: "單號",
    prop: "orderNo",
  },
  {
    label: "申請單位",
    prop: "deptName",
  },
  {
    label: "申請人",
    prop: "",
    formatter: (row, column, value) => {
      return row.applyUser.userName;
    },
  },
  {
    label: "需求評估人",
    prop: "evaluatePerson",
    formatter: (row, column, value) => {
      return row.evaluatePersonName;
    },
  },
  {
    label: "申請時間",
    prop: "createTime",
    width: 180,
    formatter: (row, column, value) => {
      return formateDate(new Date(value));
    },
  },
  {
    label: "審核人",
    prop: "auditUsers",
  },
  {
    label: "當前審核人",
    prop: "curAuditUserName",
  },
  {
    label: "審核狀態",
    prop: "applyState",
    formatter: (row, column, value) => {
      // 1:待審核 2:審核中 3:審核拒絕 4:審核通過 5:作廢
      return {
        1: "待審核",
        2: "審核中",
        3: "審核拒絕",
        4: "審核通過",
        5: "作廢",
      }[value];
    },
  },
]);

const userList = ref([]);
const showModal = ref(false);
const showDetailModel = ref(false);
const detail = ref({});
// create:創建 delete:作廢
const action = ref("");
// 創建休假彈框表單
const systemForm = ref({});
// 初始化接口調用
onMounted(() => {
  getApplyList();
  getUserList();
});

// 表單規則
const rules = {
  evaluatePerson: [
    {
      required: true,
      message: "請選擇需求評估人",
      trigger: "blur",
    },
  ],
  urgentLevel: [
    {
      required: true,
      message: "請選擇緊急程度",
      trigger: "blur",
    },
  ],
  type: [
    {
      required: true,
      message: "請選擇需求類別",
      trigger: "blur",
    },
  ],
  reasons: [
    {
      required: true,
      message: "請輸入需求說明",
      trigger: ["change", "blur"],
    },
  ],
};

const getUserList = async () => {
  userList.value = await ItUserListApi();
};

const handleUser = (val) => {
  const [userId, userName, userEmail] = val.split("/");
  Object.assign(systemForm.value, { userId, userName, userEmail });
};

// 分頁事件處理
const handleCurrentChange = (current) => {
  pager.pageNum = current;
  getApplyList();
};

// 加載申請列表
const getApplyList = async () => {
  let params = { ...queryForm, ...pager };
  let { list, page } = await systemListApi(params);
  applyList.value = list;
  pager.total = page.total;
};
const form = ref(null);
const dialogForm = ref(null);
// 重置查询表单
const handleReset = (value) => {
  if (value == "form") {
    form.value.resetFields();
  } else if (value == "dialogForm") {
    dialogForm.value.resetFields();
  }
};

const handleApply = () => {
  showModal.value = true;
  action.value = "create";
};

// 彈窗關閉
const handleClose = () => {
  handleReset("dialogForm");
  showModal.value = false;
};

// 申請提交
const handleSubmit = () => {
  dialogForm.value.validate(async (valid) => {
    if (valid) {
      try {
        const params = { ...systemForm.value, action: action.value };
        const res = await systemOperateApi(params);
        ElMessage.success("創建成功");
        handleClose();
        getApplyList();
      } catch (error) {}
    }
  });
};

const handleDetail = (row) => {
  const data = { ...row };
  detail.value = data;
  showDetailModel.value = true;
};

const handleDelete = async (_id) => {
  try {
    const params = { _id, action: "delete" };
    const res = await systemOperateApi(params);
    ElMessage.success("刪除成功");
    handleClose();
    getApplyList();
  } catch (error) {}
};
</script>
<style scoped lang='scss'>
.leave-manage {
  .dash {
    margin-left: 10px;
  }
}
</style>
