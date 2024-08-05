import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import { adminPaths } from '../../util/frontend';

const NavItem = ({ params }) => {
    const { links, icon, title, key } = params;
    return (
        // <Menu.SubMenu key={key} icon={icon} title={title}>
        //     {links.map((link, index) => (
        //         <Menu.Item key={`${link.text}-${index}`} icon={link.icon}>
        //             <Link to={link.path}>{link.text}</Link>
        //         </Menu.Item>
        //     ))}
        // </Menu.SubMenu>
        <Menu.SubMenu key={key} icon={icon} title={title}>
                 {links.map((link, index) => (
                <Menu.Item key={`${link.text}-${index}`} icon={link.icon}>
                    <Link to={link.path}>{link.text}</Link>
                </Menu.Item>
            ))}
        {/* <Menu.Item key='key-1' icon={<HomeOutlined />}>
            <Link to={adminPaths.paymentsListPath}>Payments</Link>
        </Menu.Item>
        <Menu.Item key='key-2' icon={<HomeOutlined />}>
            <Link to={adminPaths.makePaymentPath}>Enter a new payment</Link>
        </Menu.Item> */}
    </Menu.SubMenu>
    );
}

export default NavItem;