import * as React from 'react'
import {Form, Input} from 'antd'
import { FormInstance } from 'rc-field-form';

const EditableContext = React.createContext<boolean>(defaultValue);

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

export const EditableFormRow = Form.create()(EditableRow);

interface MyState {
  editing: boolean
}

interface MyProps {
  editable: any,
  dataIndex: any,
  title: any,
  record: any,
  index: any,
  handleSave: any,
  children: any,
  restProps: any
}

export class EditableCell extends React.Component<MyProps, MyState, {}> {
  state = {
    editing: false,
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = (e: { currentTarget: { id: string | number; }; }) => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error: { [x: string]: any; }, values: any) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  renderCell = (form: { getFieldDecorator: (arg0: any, arg1: { rules: { required: boolean; message: string; }[]; initialValue: any; }) => { (arg0: JSX.Element): boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | ((form: FormInstance<any>) => React.ReactNode); new(): any; }; }) => {
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${title} is required.`,
            },
          ],
          initialValue: record[dataIndex],
        })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24, minHeight: 32 }}
        onClick={this.toggleEdit}
      >
        {children}
      </div>
    );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}