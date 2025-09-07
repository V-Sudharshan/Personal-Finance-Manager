import React, { useState, useEffect, useCallback } from "react";
import { Modal, Form, Input, Select, message, Spin, Table, DatePicker, Button } from "antd";
import { UnorderedListOutlined, AreaChartOutlined } from '@ant-design/icons';
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import moment from "moment";
import Analytics from "../components/Analytics";

const { RangePicker } = DatePicker;

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allTransaction, setAllTransaction] = useState([]);
  const [frequency, setFrequency] = useState("7");
  const [selectedDate, setSelectedDate] = useState([]);
  const [type, setType] = useState("all");
  const [form] = Form.useForm();
  const [viewData, setViewData] = useState('table');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [pageSize, setPageSize] = useState(5); // State for pagination page size

  // ✅ Table Columns
  const columns = [
    { title: "Date", dataIndex: "date", key: "date", render: (text) => moment(text).format("YYYY-MM-DD") },
    { title: "Amount", dataIndex: "amount", key: "amount" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Reference", dataIndex: "reference", key: "reference" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <span>
          <Button
            type="link"
            style={{ padding: 0, marginRight: 8 }}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            type="link"
            style={{ padding: 0, color: "red" }}
            onClick={() => handleDelete(record._id)}
          >
            Delete
          </Button>
        </span>
      ),
    },
  ];

  // ✅ Fetch Transactions
  const getAllTransaction = useCallback(async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user._id) {
        message.error("User not found. Please log in again.");
        return;
      }

      setLoading(true);
      let payload = { userid: user._id, frequency };

      if (type !== "all") {
        payload.type = type;
      }

      // ✅ Fix: Send date in correct MongoDB format
      if (frequency === "custom" && selectedDate.length === 2) {
        payload.selectedDate = [
          moment(selectedDate[0]).startOf("day").toISOString(),  // Convert to full ISO
          moment(selectedDate[1]).endOf("day").toISOString()
        ];
      }

      console.log("Payload sent to backend:", payload);

      const res = await axios.post("http://localhost:8080/api/v1/get-transactions", payload);

      if (res.data.success) {
        setAllTransaction(res.data.data);
      } else {
        message.error("Failed to fetch transactions");
      }
    } catch (error) {
      console.error("Fetch Transaction Error:", error);
      message.error("Fetch Issue with Transaction");
    } finally {
      setLoading(false);
    }
  }, [frequency, selectedDate, type]);

  // ✅ Fetch transactions when filters change
  useEffect(() => {
    getAllTransaction();
  }, [getAllTransaction]);

  // ✅ Handle Form Submission
  const handleSubmit = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !user._id) {
        message.error("User not found. Please log in again.");
        return;
      }

      setLoading(true);
      values.userid = user._id;
      values.date = new Date(values.date);

      const { data } = await axios.post("http://localhost:8080/api/v1/add-transaction", values);

      if (data.success) {
        message.success("Transaction Added Successfully");
        setShowModal(false);
        form.resetFields();
        getAllTransaction(); // ✅ Refresh transactions
      } else {
        message.error("Failed to add transaction");
      }
    } catch (error) {
      console.error("Error Adding Transaction:", error);
      message.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Edit
  const handleEdit = (transaction) => {
    setSelectedTransaction(transaction); // Set the selected transaction
    setEditModalVisible(true); // Open the edit modal
  };

  // ✅ Handle Delete
  const handleDelete = async (transactionId) => {
    try {
      setLoading(true);
      const { data } = await axios.post("http://localhost:8080/api/v1/delete-transaction", {
        transactionId,
      });

      if (data.success) {
        message.success("Transaction Deleted Successfully");
        getAllTransaction(); // Refresh the transaction list
      } else {
        message.error("Failed to Delete Transaction");
      }
    } catch (error) {
      console.error("Error Deleting Transaction:", error);
      message.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Edit Submission
  const handleEditSubmit = async (values) => {
    try {
      setLoading(true);
      const { data } = await axios.post("http://localhost:8080/api/v1/edit-transaction", {
        ...values,
        transactionId: selectedTransaction._id, // Include the transaction ID
      });

      if (data.success) {
        message.success("Transaction Updated Successfully");
        setEditModalVisible(false);
        getAllTransaction(); // Refresh the transaction list
      } else {
        message.error("Failed to Update Transaction");
      }
    } catch (error) {
      console.error("Error Updating Transaction:", error);
      message.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {loading && <Spin size="large" />}

      {/* ✅ Filters Section */}
      <div className="filters">
        <div>
          <h6>Select Frequency</h6>
          <Select value={frequency} onChange={(value) => setFrequency(value)}>
            <Select.Option value="7">Last 1 Week</Select.Option>
            <Select.Option value="30">Last 1 Month</Select.Option>
            <Select.Option value="365">Last 1 Year</Select.Option>
            <Select.Option value="custom">Custom</Select.Option>
            <Select.Option value="all">All Transactions</Select.Option>
          </Select>
          {frequency === "custom" && (
            <RangePicker
              value={selectedDate}
              onChange={(dates) => setSelectedDate(dates)}
            />
          )}
        </div>
        <div>
          <h6>Select Type</h6>
          <Select value={type} onChange={(value) => setType(value)}>
            <Select.Option value="all">All</Select.Option>
            <Select.Option value="income">Income</Select.Option>
            <Select.Option value="expense">Expense</Select.Option>
          </Select>
        </div>

        <div className="switch-icons">
          <UnorderedListOutlined
            className={`mx-2 ${viewData === 'table' ? 'active-icon' : 'inactive-icon'}`}
            onClick={() => setViewData('table')}
          />
          <AreaChartOutlined
            className={`mx-2 ${viewData === 'analytics' ? 'active-icon' : 'inactive-icon'}`}
            onClick={() => setViewData('analytics')}
          />
        </div>

        <Button type="primary" onClick={() => setShowModal(true)}>
          Add New
        </Button>
      </div>

      {/* ✅ Transactions Table */}
      <div className="content">
        {viewData === 'table' ? (
          <Table
            columns={columns}
            dataSource={allTransaction}
            rowKey="_id"
            pagination={{
              pageSize: pageSize, // Use state for page size
              showSizeChanger: true,
              pageSizeOptions: [5, 10, 20, 50], // Array of numbers
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} transactions`,
              onShowSizeChange: (current, size) => {
                setPageSize(size); // Update page size in state
              },
            }}
          />
        ) : (
          <Analytics allTransaction={allTransaction} />
        )}
      </div>

      {/* ✅ Add New Transaction Modal */}
      <Modal title="Add Transaction" open={showModal} onCancel={() => setShowModal(false)} footer={null}>
        <Form layout="vertical" onFinish={handleSubmit} form={form}>
          <Form.Item label="Amount" name="amount" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Type" name="type" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Category" name="category" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="salary">Salary</Select.Option>
              <Select.Option value="tip">Tip</Select.Option>
              <Select.Option value="food">Food</Select.Option>
              <Select.Option value="movie">Movie</Select.Option>
              <Select.Option value="bills">Bills</Select.Option>
              <Select.Option value="fee">Fee</Select.Option>
              <Select.Option value="medical">Medical</Select.Option>
              <Select.Option value="tax">Tax</Select.Option>
              <Select.Option value="mobile_recharge">Mobile Recharge</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Date" name="date" rules={[{ required: true }]}>
            <Input type="date" />
          </Form.Item>
          <Form.Item label="Reference" name="reference">
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input />
          </Form.Item>
          <div className="d-flex justify-content-end">
            <Button type="primary" htmlType="submit" disabled={loading}>
              {loading ? "Adding..." : "Submit"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* ✅ Edit Transaction Modal */}
      <Modal
        title="Edit Transaction"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={handleEditSubmit}
          form={form}
          initialValues={{
            ...selectedTransaction,
            date: selectedTransaction?.date ? moment(selectedTransaction.date).format("YYYY-MM-DD") : null,
          }}
        >
          <Form.Item label="Amount" name="amount" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Type" name="type" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Category" name="category" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="salary">Salary</Select.Option>
              <Select.Option value="tip">Tip</Select.Option>
              <Select.Option value="food">Food</Select.Option>
              <Select.Option value="movie">Movie</Select.Option>
              <Select.Option value="bills">Bills</Select.Option>
              <Select.Option value="fee">Fee</Select.Option>
              <Select.Option value="medical">Medical</Select.Option>
              <Select.Option value="tax">Tax</Select.Option>
              <Select.Option value="mobile_recharge">Mobile Recharge</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Date" name="date" rules={[{ required: true }]}>
            <Input type="date" />
          </Form.Item>
          <Form.Item label="Reference" name="reference">
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input />
          </Form.Item>
          <div className="d-flex justify-content-end">
            <Button type="primary" htmlType="submit" disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </Button>
          </div>
        </Form>
      </Modal>
    </Layout>
  );
};

export default HomePage;