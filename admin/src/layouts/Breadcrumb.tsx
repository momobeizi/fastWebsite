import { Breadcrumb as AntBreadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumb = () => {
  const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter(i => i);

  const breadcrumbItems = [
    {
      title: (
        <Link to="/">
          <HomeOutlined />
          <span>首页</span>
        </Link>
      ),
    },
    ...pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      const isLast = index === pathSnippets.length - 1;
      
      // 根据路径生成对应的面包屑名称
      const getBreadcrumbName = (path: string) => {
        const breadcrumbMap: Record<string, string> = {
          'about': '关于我们',
          'users': '用户管理',
          'orders': '订单管理',
          'statistics': '统计分析',
          'settings': '系统设置',
        };
        return breadcrumbMap[path] || path;
      };

      const breadcrumbName = getBreadcrumbName(pathSnippets[index]);

      return {
        title: isLast ? (
          <span>{breadcrumbName}</span>
        ) : (
          <Link to={url}>{breadcrumbName}</Link>
        ),
      };
    }),
  ];

  return (
    <AntBreadcrumb
      style={{
        // 布局属性
        display: 'flex',
        alignItems: 'center',
        
        // 盒模型属性
        padding: '12px 0',
        margin: 0,
        
        // 文本属性
        fontSize: '14px',
        
        // 其他属性
        lineHeight: '1.5',
      }}
      items={breadcrumbItems}
    />
  );
};

export default Breadcrumb;