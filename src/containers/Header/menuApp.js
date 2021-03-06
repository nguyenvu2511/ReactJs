export const adminMenu = [
    { //quản lý người dùng
        name: 'menu.admin.manage-user',
        menus: [
            {
                name: 'menu.admin.crud-redux', link: '/system/manage-user'
            },

            {
                name: 'menu.admin.manage-doctor', link: '/system/manage-doctor'
            },

            // {
            //     name: 'menu.admin.manage-admin', link: '/system/user-admin' 
            // },

            { //quản lý lịch khám
                name: 'menu.doctor.manage-schedule', link: '/system/manage-schedule'
            },

            { //quản lý lịch khám
                name: 'Quản lý bệnh nhân', link: '/system/manage-patient'
            },
        ]
    },
    { //quản lý phòng khám
        name: 'menu.admin.clinic',
        menus: [
            {
                name: 'menu.admin.manage-clinic', link: '/system/manage-clinic'
            },
        ]
    },
    { //quản lý chuyên khoa
        name: 'menu.admin.specialty',
        menus: [
            {
                name: 'menu.admin.manage-specialty', link: '/system/manage-specialty'
            },
        ]
    },
    { //quản lý cẩm nang
        name: 'menu.admin.handbook',
        menus: [
            {
                name: 'menu.admin.manage-handbook', link: '/system/manage-handbook'
            },
        ]
    },
];

export const doctorMenu = [
    {
        name: 'menu.admin.manage-user',
        menus: [
            {
                name: 'menu.admin.manage-doctor', link: '/doctor/manage-info'
            },
            { //quản lý lịch khám
                name: 'menu.doctor.manage-schedule', link: '/doctor/manage-schedule'
            },
            { //quản lý bệnh nhân khám bệnh
                name: 'menu.doctor.manage-patient', link: '/doctor/manage-patient'
            },
            { //quản lý bệnh nhân đã khám bệnh
                name: 'menu.doctor.manage-patient-done', link: '/doctor/manage-patient-done'
            },
        ]
    }
];