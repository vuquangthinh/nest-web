import React, { Fragment, useState, useEffect, useContext } from 'react';
import DocumentTitle from 'react-document-title';

const PageContext = React.createContext({
  title: '',
  setTitle: () => {}
});

export default PageContext;

export const PageProvider = ({ children }) => {
  const [title, setTitle] = useState();

  return (
    <PageContext.Provider value={[title, setTitle]}>
      <DocumentTitle title={title}>
        {children}
      </DocumentTitle>
    </PageContext.Provider>
  );
}

export const PageTitle = ({ children, title }) => {
  const [, setTitle] = useContext(PageContext);

  useEffect(() => {
    setTitle(title);
  }, [title]);

  return <Fragment>
    {children}
  </Fragment>
}