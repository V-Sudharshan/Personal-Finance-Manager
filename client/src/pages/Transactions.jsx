import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Select } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const Transactions = () => {
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  const [transactions, setTransactions] = useState([]); // Store transactions

  // Open Modal
  const handleAddNew = () => {
    setShowModal(true);
  };

  // Close Modal
  const handleCancel = () => {
    setShowModal(false);
    form.resetFields();
  };

  // Save New Transaction
  const handleSave = () => {
    form.validateFields()
      .then(values => {
        setTransactions([...transactions, { ...values, key: transactions.length + 1 }]); // Add to table
        setShowModal(false);
        form.resetFields();
      })
      .catch(error => console.log("Validation Failed:", error));
  };

  const columns = [
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Amount", dataIndex: "amount", key: "amount" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Reference", dataIndex: "reference", key: "reference" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button icon={<EditOutlined />} size="small" style={{ marginRight: 8 }} />
          <Button icon={<DeleteOutlined />} size="small" danger />
        </>
      ),
    },
  ];

  return (
    <div style={{ width: "90%", margin: "auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
        <div>
          <select><option>LAST 1 Week</option></select>
          <select><option>ALL</option></select>
        </div>

        {/* Add New Button (Now Smaller) */}
        <Button type="primary" onClick={handleAddNew} size="small">
          Add +
        </Button>
      </div>

      {/* Transactions Table */}
      <Table columns={columns} dataSource={transactions} pagination={{ pageSize: 5 }} />

      {/* Modal for Adding Transactions */}
      <Modal
        title="Add New Transaction"
        open={showModal}
        onCancel={handleCancel}
        onOk={handleSave}
        okText="Save"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="date" label="Date" rules={[{ required: true, message: "Enter Date" }]}>
            <Input placeholder="dd-mm-yyyy" />
          </Form.Item>

          <Form.Item name="amount" label="Amount" rules={[{ required: true, message: "Enter Amount" }]}>
            <Input type="number" placeholder="Enter Amount" />
          </Form.Item>

          <Form.Item name="type" label="Type" rules={[{ required: true }]}>
            <Select placeholder="Select Type">
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Select placeholder="Select Category">
              <Select.Option value="salary">Salary</Select.Option>
              <Select.Option value="food">Food</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="reference" label="Reference">
            <Input placeholder="Enter Reference" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Transactions;
