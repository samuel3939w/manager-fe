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
        <el-button type="primary" @click="handleApply">申請休假</el-button>
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
    <el-dialog title="申請休假" v-model="showModal" width="70%">
      <el-form
        ref="dialogForm"
        :model="leaveForm"
        label-width="120px"
        :rules="rules"
        :before-close="handleClose"
      >
        <el-form-item label="休假類型" prop="applyType" required>
          <el-select v-model="leaveForm.applyType">
            <el-option label="事假" :value="1"></el-option>
            <el-option label="調休" :value="2"></el-option>
            <el-option label="年假" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="休假時間" required>
          <el-row>
            <el-col :span="8">
              <el-form-item prop="startTime" required>
                <el-date-picker
                  v-model="leaveForm.startTime"
                  type="date"
                  placeholder="選擇開始日期"
                  @change="(val) => handleDateChange('startTime', val)"
                />
              </el-form-item>
            </el-col>
            <el-col class="dash" :span="1">~</el-col>
            <el-col :span="8">
              <el-form-item prop="endTime" required>
                <el-date-picker
                  v-model="leaveForm.endTime"
                  type="date"
                  placeholder="選擇結束日期"
                  @change="(val) => handleDateChange('endTime', val)"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="休假時長" required>
          {{ leaveForm.leaveTime }}
        </el-form-item>
        <el-form-item label="休假原因" prop="reasons" required>
          <el-input
            type="textarea"
            :row="3"
            placeholder="請輸入休假原因"
            v-model="leaveForm.reasons"
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
      title="申請休假詳情"
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
        <el-form-item label="休假類型">
          <div>{{ detail.applyTypeName }}</div>
        </el-form-item>
        <el-form-item label="休假時間">
          <div>{{ detail.time }}</div>
        </el-form-item>
        <el-form-item label="休假時長">
          <div>{{ detail.leaveTime }}</div>
        </el-form-item>
        <el-form-item label="休假原因">
          <div>{{ detail.reasons }}</div>
        </el-form-item>
        <el-form-item label="審核人">
          <div>{{ detail.curAuditUserName }}</div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { ElMessage } from "element-plus";
import { ref, reactive, onMounted } from "vue";
import { applyListApi, leaveOperateApi } from "../api";
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
    label: "休假時間",
    prop: "",
    formatter(row) {
      return (
        formateDate(new Date(row.startTime), "yyyy-MM-dd") +
        "到" +
        formateDate(new Date(row.endTime), "yyyy-MM-dd")
      );
    },
  },
  {
    label: "休假時長",
    prop: "leaveTime",
  },
  {
    label: "休假類型",
    prop: "applyType",
    formatter(row, column, value) {
      return {
        1: "事假",
        2: "調休",
        3: "年假",
      }[value];
    },
  },
  {
    label: "休假原因",
    prop: "reasons",
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

const showModal = ref(false);
const showDetailModel = ref(false);
const detail = ref({});
// create:創建 delete:作廢
const action = ref("");
// 創建休假彈框表單
const leaveForm = reactive({});
// 初始化接口調用
onMounted(() => {
  getApplyList();
});

// 表單規則
const rules = {
  applyType: [
    {
      required: true,
      message: "請選擇休假類型",
      trigger: "blur",
    },
  ],
  startTime: [
    {
      type: "date",
      required: true,
      message: "請輸入開始日期",
      trigger: ["change", "blur"],
    },
  ],
  endTime: [
    {
      type: "date",
      required: true,
      message: "請輸入結束日期",
      trigger: ["change", "blur"],
    },
  ],
  reasons: [
    {
      required: true,
      message: "請輸入休假原因",
      trigger: ["change", "blur"],
    },
  ],
};

// 分頁事件處理
const handleCurrentChange = (current) => {
  pager.pageNum = current;
  getApplyList();
};

// 加載申請列表
const getApplyList = async () => {
  let params = { ...queryForm, ...pager };
  let { list, page } = await applyListApi(params);
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
    leaveForm.leaveTime = "";
    dialogForm.value.resetFields();
  }
};

const handleApply = () => {
  showModal.value = true;
  action.value = "create";
};

// 彈窗關閉
const handleClose = () => {
  showModal.value = false;
  handleReset("dialogForm");
};
// 獲取休假時長
const handleDateChange = (key, val) => {
  const { startTime, endTime } = leaveForm;
  if (!startTime || !endTime) return;
  if (startTime > endTime) {
    ElMessage.error("開始日期必須小於結束日期");
    leaveForm.leaveTime = "0天";
    setTimeout(() => {
      leaveForm[key] = "";
    });
  } else {
    leaveForm.leaveTime =
      (endTime - startTime) / (24 * 60 * 60 * 1000) + 1 + "天";
  }
};

// 申請提交
const handleSubmit = () => {
  dialogForm.value.validate(async (valid) => {
    if (valid) {
      try {
        const params = { ...leaveForm, action: action.value };
        const res = await leaveOperateApi(params);
        ElMessage.success("創建成功");
        handleClose();
        getApplyList();
      } catch (error) {}
    }
  });
};

const handleDetail = (row) => {
  const data = { ...row };
  data.applyTypeName = {
    1: "事假",
    2: "調修",
    3: "年假",
  }[data.applyType];

  data.time =
    formateDate(new Date(data.startTime), "yyyy-MM-dd") +
    "到" +
    formateDate(new Date(data.endTime), "yyyy-MM-dd");
  data.applyStateName = {
    1: "待審核",
    2: "審核中",
    3: "審核拒絕",
    4: "審核通過",
    5: "作廢",
  }[data.applyState];
  detail.value = data;
  showDetailModel.value = true;
};

const handleDelete =async (_id) => {
  try {
    const params = { _id, action: "delete" };
    const res = await leaveOperateApi(params);
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
