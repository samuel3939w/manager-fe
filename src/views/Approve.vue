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
      <div class="action"></div>
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
            <el-button
              v-if="
                scope.row.curAuditUserName == userInfo.userName &&
                [1, 2].includes(scope.row.applyState)
              "
              size="small"
              @click="handleDetail(scope.row)"
              >審核</el-button
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
      title="審核"
      width="50%"
      v-model="showDetailModel"
      destroy-on-close
      :before-close="handleClose"
    >
      <el-form
        ref="dialogForm"
        :model="auditForm"
        label-width="120px"
        label-suffix=":"
        :rules="rules"
      >
        <el-form-item label="申請人">
          <div>{{ detail.applyUser.userName }}</div>
        </el-form-item>
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
        <el-form-item label="備註" prop="remark">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="請輸入審核備註"
            v-model="auditForm.remark"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleApprove('pass')">審核通過</el-button>
          <el-button @click="handleApprove('refuse')" type="danger"
            >駁回</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ElMessage } from "element-plus";
import { ref, reactive, onMounted } from "vue";
import { useStore } from "vuex";
import { applyListApi, leaveApproveApi } from "../api";
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
    label: "申請人",
    prop: "",
    formatter(row) {
      return row.applyUser.userName;
    },
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

const showDetailModel = ref(false);
// 詳情彈框對象
const detail = ref({});
const store = useStore();
const userInfo = store.state.userInfo;

// 初始化接口調用
onMounted(() => {
  getApplyList();
});

// 表單規則
const rules = {
  remark: [
    {
      required: true,
      message: "請輸入審核備註",
      trigger: "blur",
    },
  ],
};

// 分頁事件處理
const handleCurrentChange = (current) => {
  pager.pageNum = current;
  getApplyList();
};

const auditForm = reactive({
  remark: "",
});

// 加載申請列表
const getApplyList = async () => {
  let params = { ...queryForm, ...pager, type: "approve" };
  let { list, page } = await applyListApi(params);
  applyList.value = list;
  pager.total = page.total;
};

const dialogForm = ref(null);
// 重置查询表单
const handleReset = () => {
  dialogForm.value.resetFields();
};

// 彈窗關閉
const handleClose = () => {
  showDetailModel.value = false;
  handleReset();
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

const handleApprove = (action) => {
  dialogForm.value.validate(async (valid) => {
    if (valid) {
      let params = { action, remark: auditForm.remark, _id: detail.value._id };
      try {
        await leaveApproveApi(params);
        ElMessage.success("處理成功");
        getApplyList();
        handleClose();
      } catch (error) {}
    }
  });
};
</script>
<style scoped lang='scss'>
.leave-manage {
  .dash {
    margin-left: 10px;
  }
}
</style>
