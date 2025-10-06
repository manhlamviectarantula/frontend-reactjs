import { Col, Nav } from 'react-bootstrap';
import { useLocation, NavLink, matchPath, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { store } from '../redux/store';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import BusinessIcon from '@mui/icons-material/Business';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/apiCalls';

const CustomNavLink = styled(Nav.Link)`
    font-weight: 600; 
    color: black;
    text-decoration: none;
    padding: 15px;

    &:hover, &:active {
        color: black;
        background-color: #d1d1d1;
    }

    &.active {
        color: black;
        background-color: #cccccc;
    }

    /* riêng Đăng xuất */
    &.logout-link:hover {
        color: white;
        background-color: #dc3545;
    }
`;


const Sidebar = ({ links }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const logo = store.getState().user.currentUser?.user.AccountTypeID;

    const handleLogout = () => {
        logout(dispatch);
        navigate('/');
        window.scrollTo(0, 0);
    };

    return (
        <Col md={2} className="bg-light px-0 py-3">
            <div className="d-flex justify-content-between px-3 mb-3">
                <img
                    src={`https://res.cloudinary.com/dnpo0jukc/image/upload/v1759719075/Designer-Photoroom_rrk4es.png`}
                    alt="Cinema logo - homepage"
                    height="40"
                />
                {logo === 3 ? (
                    <ManageAccountsIcon style={{ marginLeft: "10px", fontSize: "30px" }} />
                ) : logo === 2 ? (
                    <BusinessIcon style={{ marginLeft: "10px", fontSize: "30px" }} />
                ) : null}
            </div>

            <Nav className="flex-column">
                {links.map((link, index) => {
                    const isActive =
                        location.pathname === link.path ||
                        (link.path === "/manageTheater" &&
                            (location.pathname === "/addTheater" || location.pathname === "/designSeats" || matchPath("/detailsTheater/:TheaterID", location.pathname)));

                    if (link.label === "Đăng xuất") {
                        return (
                            <CustomNavLink
                                as="div" 
                                key={index}
                                onClick={handleLogout}
                                className="logout-link"
                                style={{ cursor: "pointer" }}
                            >
                                {link.label}
                            </CustomNavLink>
                        );
                    }

                    return (
                        <CustomNavLink
                            as={NavLink}
                            to={link.path}
                            key={index}
                            className={`${isActive ? "active" : ""}`}
                        >
                            {link.label}
                        </CustomNavLink>
                    );
                })}
            </Nav>
        </Col>
    );
};

export default Sidebar;
