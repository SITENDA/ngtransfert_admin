import { Menu } from "antd"
import { Link } from "react-router-dom";


const { SubMenu: AntDSubMenu } = Menu;

const SubMenu = ({ params }) => {
    const { key, title, icon, items } = params
    return (
        <AntDSubMenu key={key} icon={icon} title={title}>
            {
                items.map((item, index) => (
                    <Menu.Item key={`${item.text}-${index}`} icon={item.icon}>
                        <Link to={item.path}>{item.text}</Link>
                    </Menu.Item>
                ))
            }

        </AntDSubMenu>
    )
}

export default SubMenu