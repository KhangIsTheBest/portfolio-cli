export const translations = {
  vi: {
    nav: {
      home: 'Trang chủ',
      about: 'Giới thiệu',
      skills: 'Kỹ năng',
      projects: 'Dự án',
      blog: 'Blogs',
      contact: 'Liên hệ'
    },
    home: {
      welcome: 'Không gian làm việc Full-Stack',
      titlePrefix: 'Xin chào, tôi là ',
      projectsBtn: 'Xem dự án',
      contactBtn: 'Liên hệ với tôi',
      subtitle: 'Chào mừng bạn đến với không gian làm việc số của tôi. Tôi xây dựng các giải pháp phần mềm mạnh mẽ và tối ưu trải dài từ Frontend đến Backend. Hãy khám phá hồ sơ năng lực của tôi!'
    },
    about: {
      title: 'Giới thiệu bản thân',
      location: 'Việt Nam',
      secureChannels: 'Kênh liên lạc an toàn'
    },
    skills: {
      title: 'Hồ sơ năng lực & Kỹ năng',
      diagTitle: 'Chẩn đoán hệ thống',
      diagRest: 'Link REST API:',
      diagDb: 'Kết nối Database:',
      diagWeb: 'Nền tảng Web:',
      diagProtocol: 'Giao thức kết nối:',
      diagFallback: 'Dữ liệu dự phòng:',
      diagFallbackVal: 'Kích hoạt dữ liệu Hybrid',
      diagConnected: 'ĐÃ KẾT NỐI',
      databaseVal: 'PostgreSQL Server',
      webVal: 'Next.js 15 AppRouter'
    },
    projects: {
      title: 'Dự án nổi bật',
      total: 'Tổng số:',
      featuredLabel: 'NỔI BẬT',
      detailsBtn: 'Chi tiết',
      backCatalog: 'Quay lại danh sách',
      detailTitle: 'Chi tiết dự án',
      dateLabel: 'Ngày hoàn thành:',
      repoLabel: 'Mã nguồn GitHub',
      demoLabel: 'Trải nghiệm Live Demo'
    },
    blog: {
      title: 'Bài viết & Chia sẻ',
      noArticles: 'Chưa có bài viết nào được xuất bản. Vui lòng quay lại sau!',
      articleViewer: 'Trình xem bài viết',
      closeBtn: 'Đóng (ESC)',
      dateLabel: 'Ngày đăng:',
      authorLabel: 'Tác giả:'
    },
    contact: {
      title: 'Gửi tin nhắn liên hệ',
      successTitle: 'Gửi tin nhắn thành công!',
      successDesc: 'Tin nhắn của bạn đã được ghi nhận vào cơ sở dữ liệu Spring Boot. Cảm ơn bạn đã liên hệ!',
      nameLabel: 'Họ và tên *',
      namePlaceholder: 'VD: Nguyễn Văn A',
      emailLabel: 'Địa chỉ Email *',
      emailPlaceholder: 'VD: nguyenvana@example.com',
      subjectLabel: 'Tiêu đề tin nhắn',
      subjectPlaceholder: 'VD: Hợp tác công việc / Tư vấn',
      msgLabel: 'Nội dung tin nhắn *',
      msgPlaceholder: 'Nhập nội dung chi tiết tin nhắn tại đây...',
      submitBtn: 'Gửi tin nhắn',
      submittingBtn: 'Đang truyền gói tin...'
    }
  },
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      skills: 'Skills',
      projects: 'Projects',
      blog: 'Blogs',
      contact: 'Contact'
    },
    home: {
      welcome: 'Full-Stack Web Workspace',
      titlePrefix: 'Hello, I am ',
      projectsBtn: 'Browse Projects',
      contactBtn: 'Get In Touch',
      subtitle: 'Welcome to my digital workspace. I build robust and elegant software solutions spanning front-to-back technologies. Feel free to explore my background, technical skill stack, recent project catalogs, and blog posts!'
    },
    about: {
      title: 'About Me',
      location: 'Vietnam',
      secureChannels: 'Secure Channels'
    },
    skills: {
      title: 'Skills & Tech Stack',
      diagTitle: 'System Diagnostics',
      diagRest: 'REST API Link:',
      diagDb: 'Database Connect:',
      diagWeb: 'Web Platform:',
      diagProtocol: 'API Protocol:',
      diagFallback: 'Data Fallback:',
      diagFallbackVal: 'Hybrid Mock Enabled',
      diagConnected: 'CONNECTED',
      databaseVal: 'PostgreSQL Server',
      webVal: 'Next.js 15 AppRouter'
    },
    projects: {
      title: 'Featured Projects',
      total: 'Total:',
      featuredLabel: 'FEATURED',
      detailsBtn: 'Details',
      backCatalog: 'Back to Catalog',
      detailTitle: 'Project Detail View',
      dateLabel: 'Completed Date:',
      repoLabel: 'GitHub Repository',
      demoLabel: 'Launch Live Demo'
    },
    blog: {
      title: 'Writing & Articles',
      noArticles: 'No articles published yet. Check back later!',
      articleViewer: 'Article Viewer',
      closeBtn: 'Close (ESC)',
      dateLabel: 'Published Date:',
      authorLabel: 'Author:'
    },
    contact: {
      title: 'Get In Touch',
      successTitle: 'Message Sent Successfully!',
      successDesc: 'Your message has been saved to the Spring Boot database. Thank you for reaching out!',
      nameLabel: 'Your Name *',
      namePlaceholder: 'e.g. John Doe',
      emailLabel: 'Your Email *',
      emailPlaceholder: 'e.g. john@example.com',
      subjectLabel: 'Subject',
      subjectPlaceholder: 'e.g. Inquiry / Collaboration',
      msgLabel: 'Message *',
      msgPlaceholder: 'Type message content here...',
      submitBtn: 'Transmit Message',
      submittingBtn: 'Transmitting Secure Packet...'
    }
  }
};

export type TranslationKeys = typeof translations.en;
