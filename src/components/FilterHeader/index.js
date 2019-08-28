import React, { useState, useEffect } from 'react';

import { Tabs } from 'antd';
import styles from './index.less';

const { TabPane } = Tabs;

function FilterHeader({ tabs, current, onTabClick, children }) {

  const [activeKey, setActiveKey] = useState(tabs.length === 0 ? null : tabs[0].value);

  // flick ui
  useEffect(() => {
    setTimeout(() => {
      setActiveKey(current);
    }, 100);
  }, [current]);

  return (
    <div className={styles.container}>
      <Tabs activeKey={String(activeKey)} onChange={onTabClick}>
        {tabs.map(tab => (
          <TabPane tab={tab.label} key={String(tab.value)} />
        ))}
      </Tabs>
      <div className={styles.content}>{children}</div>
    </div>
  );
}

FilterHeader.defaultProps = {
  tabs: [],
  current: null,
  onTabClick: () => {},
  children: null,
};

export default FilterHeader;
