import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Skeleton } from 'antd';
import classNames from 'classnames';
import styles from './index.less';
import BreadcrumbView from './breadcrumb';


@connect(_ => ({ application: _.global.application }))
export default class PageHeader extends PureComponent {
  componentDidMount() {
    // trick, customize <title></title>
    const { title, application } = this.props;
    if (title) {
      document.title = `${title} - ${application.name}`;
    }
  }

  componentDidUpdate() {
    const { title, application } = this.props;
    if (document.title !== title) {
      document.title = `${title} - ${application.name}`;
    }
  }

  onChange = key => {
    const { onTabChange } = this.props;
    if (onTabChange) {
      onTabChange(key);
    }
  };

  render() {
    const { className, loading = false, wide = false, hiddenBreadcrumb = false } = this.props;

    const clsString = classNames(styles.pageHeader, className);

    return (
      <div className={clsString}>
        <div className={wide ? styles.wide : ''}>
          <Skeleton
            loading={loading}
            title={false}
            active
            paragraph={{ rows: 3 }}
            avatar={{ size: 'large', shape: 'circle' }}
          >
            {hiddenBreadcrumb ? null : <BreadcrumbView {...this.props} />}
          </Skeleton>
        </div>
      </div>
    );
  }
}
