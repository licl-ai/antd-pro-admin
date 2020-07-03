import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import debounce from 'lodash/debounce';
import request from '@/utils/request';
import styles from './index.less';

let currentValue: string;
const fetchData = async function(url: string, value: string, callback: Function) {
  value = value || '';
  currentValue = value;
  const result = await request(`${url}`, {
    params: {
      term: value,
    },
  });
  if (currentValue === value && typeof result === 'object' && callback) {
    callback(result);
  }
};
const debounceFetchData = debounce(fetchData, 300);

interface AutoListViewColumnProps {
  title: string;
  dataIndex: string;
  key: string;
  width?: number;
}

export interface AutoListViewProps {
  columns: AutoListViewColumnProps[];
  url: string;
  valueColumn: string;
  style?: React.CSSProperties;
  placeholder?: string;
  value?: string;
  onChange?: (value: string | undefined, option: AutoListViewOption) => void;
  showMenuHeader?: boolean;
  type?: 'select' | 'search';
}

export interface AutoListViewOption {
  label?: React.ReactElement;
  optiondata: object;
  value: string;
}

const AutoListView: React.FC<AutoListViewProps> = props => {
  const {
    columns,
    value,
    url,
    valueColumn,
    style,
    placeholder,
    onChange,
    showMenuHeader = true,
    type = 'search',
  } = props;
  const [data, setData] = useState([]);
  const isSearch = type === 'search' ? true : false;

  useEffect(() => {
    fetchData(url, value as string, (data: never[]) => setData(data));
  }, []);

  const handleSearch = (value: string) => {
    debounceFetchData(url, value, (data: never[]) => setData(data));
  };

  const handleChange = (value: string, option: any) => {
    if (isSearch && value === undefined) {
      debounceFetchData(url, '', (data: never[]) => setData(data));
    }
    if (onChange) {
      onChange(value, option || { value: undefined, data: {} });
    }
  };

  const renderMenu = (menu: React.ReactElement) => {
    return (
      <div>
        {showMenuHeader && (
          <div className={styles.headerWrap} style={{ background: '#c2c0c0' }}>
            {columns.map(({ title, width = 80 }) => (
              <span key={title} className={styles.headerItem} style={{ width: width }}>
                {title}
              </span>
            ))}
          </div>
        )}
        {menu}
      </div>
    );
  };
  let selectWidth = 30;
  columns.map(({ width = 80 }) => {
    selectWidth += width;
  });
  const options: AutoListViewOption[] = data.map(row => ({
    value: row[valueColumn],
    optiondata: row,
    label: (
      <div>
        {columns.map(({ dataIndex, width = 80 }, i) => (
          <span
            key={`${row[valueColumn]}-${i}`}
            className={styles.content}
            style={{ width: width }}
          >
            {row[dataIndex] || ''}
          </span>
        ))}
      </div>
    ),
  }));
  return (
    <Select
      allowClear={isSearch}
      showSearch={isSearch}
      value={value}
      placeholder={placeholder}
      defaultActiveFirstOption
      showArrow={!isSearch}
      filterOption={false}
      onSearch={isSearch ? handleSearch : undefined}
      onChange={handleChange}
      notFoundContent={null}
      dropdownRender={renderMenu}
      options={options}
      optionLabelProp="value"
      bordered
      // open
      // labelInValue
      dropdownMatchSelectWidth={selectWidth}
      style={style}
    />
  );
};

export default AutoListView;
