import { Spin, TableColumnProps, Table } from "antd";
import { useRequest } from "ahooks";
import { ReturnType, getEtfList } from "../../services/api/getEtfList";

const List = () => {
  const { data } = useRequest(() => getEtfList());

  if (!data) {
    return <Spin />;
  }

  const columns: TableColumnProps<ReturnType>[] = [
    {
      title: "code",
      dataIndex: "code",
      render(value: string) {
        return <a href={`/etf/${value}`}>{value}</a>;
      },
    },
    {
      title: "名称",
      dataIndex: "name",
      render(value: string, record) {
        return <a href={`/etf/${record.code}`}>{value}</a>;
      },
    },
  ];

  return (
    <div>
      <div>最近概览</div>
      <div>
        <Table rowKey="code" columns={columns} dataSource={data} />
      </div>
    </div>
  );
};
export default List;
