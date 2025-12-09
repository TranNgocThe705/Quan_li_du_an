TRƯỜNG ĐẠI HỌC VINH
VIỆN KỸ THUẬT VÀ CÔNG NGHỆ


   

BÁO CÁO
ĐỒ ÁN TỐT NGHIỆP ĐẠI HỌC


XÂY DỰNG WEB QUẢN LÍ DỰ ÁN VÀ CÔNG VIỆC NHÓM TÍCH HỢP AI


  GVHD:	TS. Đặng Hồng Lĩnh
SVTH:	Trần Ngọc Thế, 215748020110414
	
	
Nghệ An, 12/2025 
LỜI MỞ ĐẦU
Trong một thế giới đang dần chuyển mình dưới tác động của công nghệ, khi chiếc điện thoại trở thành người bạn đồng hành mỗi ngày, mối quan hệ giữa con người và thiên nhiên cũng được kết nối theo cách mới mẻ. Đối với những người yêu cây, người làm vườn và những ai yêu mến thiên nhiên, việc nhận diện chính xác một loài cây, phát hiện sớm bệnh lý hay tổ chức lịch chăm sóc là điều rất quan trọng nhưng không phải lúc nào cũng dễ thực hiện. Từ nhu cầu thực tiễn ấy, dự án DocPlant được hình thành với mong muốn đưa kiến thức, công nghệ và cộng đồng lại gần nhau hơn nơi công nghệ hỗ trợ con người chăm sóc thiên nhiên tốt hơn.
DocPlant là một ứng dụng di động được xây dựng nhằm hỗ trợ người dùng trong việc nhận diện cây trồng thông qua hình ảnh, lưu trữ hồ sơ cá nhân về cây trồng, lên lịch chăm sóc và kết nối cộng đồng để chia sẻ kinh nghiệm. Ứng dụng được phát triển trên nền tảng React Native, tích hợp dịch vụ Firebase (Authentication) cho phần dữ liệu và backend Node.js cho các dịch vụ đặc thù như xử lý ảnh và API. Đồng thời, mô hình nhận diện được tích hợp thông qua TensorFlow Lite để phù hợp với việc tra cứu nhanh ngay trên thiết bị.
Trong quá trình thực hiện đồ án, em đã nhận được sự hướng dẫn tận tình và hỗ trợ quý báu từ thầy TS Đặng Hồng Lĩnh cùng các thầy cô trong ngành Công nghệ Thông tin và bạn bè, thầy Việt không chỉ giúp định hướng về mặt chuyên môn mà còn truyền đạt những kinh nghiệm thực tiễn để hoàn thiện tốt sản phẩm đồ án. Thầy đã dành nhiều thời gian để phân tích, góp ý và chỉ ra những điểm cần cải thiện, giúp em hiểu rõ hơn về bản chất của vấn đề cũng như cách thức triển khai. Nhờ sự đồng hành và sự quan tâm tận tình của thầy,  em hoàn thành tốt đồ án của mình một cách thuận lợi và tiếp thu được thêm nhiều kiến thức mới. Tuy nhiên, trong quá trình thực hiện đồ án do giới hạn về kiến thức và kinh nghiệm, bài báo cáo của em chắc chắn không thể tránh khỏi những thiếu sót. Em rất mong nhận được sự góp ý chân thành từ thầy và các thầy cô trong hội đồng, để sản phẩm đồ án của em có thể ngày càng hoàn thiện hơn.
Em xin chân thành cảm ơn !
 
DANH SÁCH CÁC HÌNH
Hình 1.1. Website tìm kiếm việc làm TopCV ………………………………………12
Hình 1.2. Website tìm kiếm việc làm Tìm việc 365 ………………………………...13
Hình 1.3. Website tìm kiếm việc làm Vietnamworks ………………………………14
Hình 3. 2 Biểu đồ ca sử dụng của tác nhà tuyển dụng và ứng viên …………36
Hình 3. 3 Sơ đồ hoạt động chức năng đăng ký tài khoản …………………………....39
Hình 3. 4 Sơ đồ hoạt động chức năng đăng nhập tài khoản ………………………....41
Hình 3. 5 Sơ đồ hoạt động chức năng tạo bài đăng tuyển dụng ……………………44
Hình 3. 6 Sơ đồ hoạt động chức năng sửa bài đăng tuyển dụng …………………….46
Hình 3. 7 Sơ đồ hoạt động chức năng phê duyệt hồ sơ ứng viên …………………...49
Hình 3. 8 Sơ đồ hoạt động chức năng đăng ký dịch vụ ……………………………52
Hình 3. 9 Sơ đồ hoạt động chức năng tìm kiếm việc làm …………………………54
Hình 3. 10 Sơ đồ hoạt động chức năng lưu việc làm nổi bật ………………………56
Hình 3. 11 Sơ đồ hoạt động chức năng nộp hồ sơ ứng tuyển ………………………58
Hình 3. 12 Sơ đồ hoạt động chức năng quản lý lịch sư hồ sơ ứng tuyển …………….60
Hình 3. 13 Sơ đồ hoạt động chức năng xem kết quả hồ sơ ứng tuyển ……………….62
Hình 3. 14 Sơ đồ hoạt động chức năng phê duyệt bài đăng tuyển dụng ……………..64
Hình 3. 15 Sơ đồ hoạt động chức năng quản lý danh mục bài viết ………………….66
Hình 3. 16 Biểu đồ phân lớp của hệ thống …………………………………………69
Hình 4. 1 Model User tương ứng với bảng tbl_user …………………………77
Hình 4. 2 Các phương thức truy xuất dữ liệu trong UserRepository ………………77
Hình 4. 3 Lớp UserService …………………………………………………………78
Hình 4. 4 Lớp UserController ……………………………………………………...78
Hình 4. 5 Tệp show.jsp xử lý hiển thị giao diện trang chủ …………………………79
Hình 4. 6 Giao diện trang đăng nhập ……………………………………………….80
Hình 4. 7 Giao diện trang việc làm …………………………………………………80
Hình 4. 8 Giao diện trang công ty …………………………………………………81
Hình 4. 9 Giao diện trang bài viết …………………………………………………82
Hình 4. 10 Giao diện trang chi tiết việc làm ………………………………………83
Hình 4. 11 Giao diện trang thông tin tài khoản ……………………………………84
Hình 4. 12 Giao diện trang tạo bài đăng tuyển dụng ………………………………85
Hình 4. 13 Giao diện trang danh sách bài đăng tuyển dụng ……………………….86
Hình 4. 15 Giao diện trang phê duyệt hồ sơ ứng viên ………………………………86
Hình 4. 16 Giao diện trang việc làm yêu thích …………………………………….87
Hình 4. 17 Giao diện trang lịch sử việc làm ứng tuyển ……………………………88
Hình 4. 18 Giao diện trang kết quả ứng tuyển ………………………………………89
Hình 4. 19 Giao diện trang quản lý tài khoản ………………………………………89
Hình 4. 20 Giao diện trang phê duyệt đăng bài ……………………………………90
Hình 4. 21 Giao diện trang quản lý dịch vụ ………………………………………..91

 
DANH SÁCH CÁC BẢNG
Bảng 1. 1 Bảng yêu cầu các chức năng quản trị viên ……………………………….15
Bảng 1. 2 Bảng yêu cầu các chức năng nhà tuyển dụng …………………………….17
Bảng 1. 3 Bảng yêu cầu các chức năng ứng viên …………………………………...18
Bảng 3. 1 Mô tả chi tiết chức năng đăng ký  …………………………………37
Bảng 3. 2 Mô tả chi tiết chức năng đăng nhập ……………………………………...40
Bảng 3. 3 Mô tả chi tiết chức năng đăng xuất ………………………………………42
Bảng 3. 4 Mô tả chi tiết chức năng tạo bài đăng tuyển dụng ……………………….43
Bảng 3. 5 Mô tả chi tiết chức năng tạo bài đăng tuyển dụng ……………………….45
Bảng 3. 6 Mô tả chi tiết chức năng xóa bài đăng tuyển dụng ………………………47
Bảng 3. 7 Mô tả chi tiết chức năng phê duyệt hồ sơ ứng tuyển …………………….48
Bảng 3. 8 Mô tả chi tiết chức năng từ chối hồ sơ ứng tuyển ……………………….50
Bảng 3. 9 Mô tả chi tiết chức năng đăng ký dịch vụ ……………………………….51
Bảng 3. 10 Mô tả chi tiết chức năng tìm kiếm việc làm ……………………………53
Bảng 3. 11 Mô tả chi tiết chức năng lưu việc làm nổi bật ………………………….55
Bảng 3. 12 Mô tả chi tiết chức năng nộp hồ sơ ứng tuyển …………………………57
Bảng 3. 13 Mô tả chi tiết chức năng lịch sử hồ sơ ứng tuyển ……………………...59
Bảng 3. 14 Mô tả chi tiết chức năng xem kết quả hồ sơ ứng tuyển ………………..61
Bảng 3. 15 Mô tả chi tiết chức năng phê duyệt bài đăng tuyển dụng ……………...63
Bảng 3. 16 Mô tả chi tiết chức năng quản lý danh mục bài viết …………………...65
Bảng 3. 17 Mô tả chi tiết chức năng quản lý bài viết ……………………………....67
Bảng 3. 18 Mô tả chi tiết chức năng quản lý bài viết ………………………………68
Bảng 3. 19 Bảng cơ sở dữ liệu tbl_user …………………………………………….70
Bảng 3. 20 Bảng cơ sở dữ liệu tbl_role …………………………………………….71
Bảng 3. 21 Bảng cơ sở dữ liệu tbl_plan …………………………………………….71
Bảng 3. 22 Bảng cơ sở dữ liệu tbl_category ………………………………………..72
Bảng 3. 23 Bảng cơ sở dữ liệu tbl_post …………………………………………….72
Bảng 3. 24 Bảng cơ sở dữ liệu tbl_OrderPlan ……………………………………...73
Bảng 3. 25 Bảng cơ sở dữ liệu tbl_job ……………………………………………..73
Bảng 3. 26 Bảng cơ sở dữ liệu tbl_joblike …………………………………………74
Bảng 3. 27 Bảng cơ sở dữ liệu tbl_apply …………………………………………..75

 
MỤC LỤC
LỜI MỞ ĐẦU	1
DANH SÁCH CÁC HÌNH	2
DANH SÁCH CÁC BẢNG	4
MỤC LỤC	6
CHƯƠNG 1: MÔ TẢ BÀI TOÁN HỆ THỐNG DOCPLANT	9
1.1. Bài toán nhận diện và quản lý cây trồng	9
1.2. Khảo sát nghiệp vụ	9
1.2.1. Mục tiêu và chức năng hệ thống	9
1.2.2. Quy trình nghiệp vụ	9
1.3. Khảo sát một số website/app liên quan	9
1.3.1. PlantNet	9
1.3.2. PictureThis	9
1.3.3. iNaturalist	9
1.4. Hình thành ý tưởng thiết kế hệ thống DocPlant	9
1.4.1. Yêu cầu chức năng	9
1.4.2. Yêu cầu phi chức năng	10
CHƯƠNG 2: TÌM HIỂU VỀ CÔNG CỤ PHÁT TRIỂN HỆ THỐNG	11
2.1. Tổng quan về ngôn ngữ lập trình JavaScript và TypeScript	11
2.1.1. Giới thiệu về JavaScript và TypeScript	11
2.1.2. Ưu điểm khi sử dụng JavaScript/TypeScript trong phát triển ứng dụng đa nền tảng	11
2.2. Giới thiệu về React Native	12
2.2.1. React Native là gì?	12
2.2.2. Kiến trúc và các thành phần chính của React Native	12
2.2.3. Lợi ích khi sử dụng React Native cho DocPlant	13
2.3. Quản lý trạng thái với Redux	13
2.3.1. Redux là gì?	13
2.3.2. Cách Redux hoạt động trong DocPlant	13
2.3.3. Middleware và các slice trong Redux	14
2.4. Tích hợp Firebase vào hệ thống	14
2.4.1. Firebase là gì?	14
2.4.2. Các dịch vụ Firebase sử dụng trong DocPlant (Authentication, Firestore, Storage, v.v.)	14
2.4.3. Quy trình tích hợp Firebase với React Native	15
2.5. Xây dựng backend với Node.js (image-upload-server)	15
2.5.1. Tổng quan về Node.js	15
2.5.2. Kiến trúc backend và API phục vụ DocPlant	15
2.5.3. Giao tiếp giữa frontend và backend	16
2.6. Thiết kế giao diện người dùng	16
2.6.1. Sử dụng các thư viện UI (React Native Paper, Native Base, v.v.)	16
2.6.2. Tối ưu trải nghiệm người dùng trên đa nền tảng	16
2.7. Công cụ phát triển và kiểm thử	16
2.7.1. Sử dụng Jest cho kiểm thử	16
2.7.2. Công cụ debug và phát triển (Metro, Chrome DevTools, v.v.)	16
CHƯƠNG 3: PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG DOCPLANT	18
3.1. Phân tích hệ thống DocPlant	18
3.1.1. Biểu đồ ca sử dụng (Use Case Diagram)	18
3.1.2. Các luồng nghiệp vụ chính	18
3.2. Tổng quan các chức năng của hệ thống	18
3.2.1. Chức năng đăng ký, đăng nhập, đăng xuất tài khoản	18
3.2.2. Chức năng dành cho người dùng	18
3.2.3. Chức năng dành cho quản trị viên	18
3.2.4. Chức năng tích hợp dịch vụ (Firebase, backend Node.js)	18
3.3. Thiết kế cơ sở dữ liệu hệ thống	18
3.3.1. Biểu đồ lớp (Class Diagram)	18
3.3.2. Thiết kế các collection dữ liệu chính	18
3.4. Thiết kế giao diện và kiến trúc hệ thống	19
3.4.1. Thiết kế giao diện người dùng (UI/UX)	19
3.4.2. Kiến trúc hệ thống (Frontend, Backend, Database, Firebase)	19
CHƯƠNG 4: TRIỂN KHAI XÂY DỰNG HỆ THỐNG	20
4.1. Cấu trúc xây dựng hệ thống	20
4.1.1. Các lớp trong phần domain	20
4.1.2. Các lớp trong phần repository	21
4.1.3. Các lớp trong phần service	22
4.1.4. Các lớp trong phần controller	22
4.1.5. Các tệp thư mục trong phần webapp	23
4.2. Triển khai giao diện website	24
4.2.1. Giao diện dùng chung	24
4.2.2. Giao diện dành cho vị trí nhà tuyển dụng	28
4.2.3. Giao diện dành cho vị trí ứng viên	32
4.2.4. Một số giao diện dành cho vị trí quản trị viên	34
KẾT LUẬN	37
TÀI LIỆU THAM KHẢO	38

 
CHƯƠNG 1: MÔ TẢ BÀI TOÁN HỆ THỐNG DOCPLANT
1.1. Bài toán nhận diện và quản lý cây trồng
Trong thực tế, nhiều người gặp khó khăn khi nhận diện các loại cây trồng, chăm sóc cây đúng cách hoặc tìm kiếm thông tin về cây. Đặc biệt, với những người mới bắt đầu hoặc không có kiến thức chuyên sâu, việc xác định tên cây, đặc điểm sinh trưởng, cách chăm sóc… là một thách thức lớn.
DocPlant ra đời nhằm hỗ trợ người dùng nhận diện cây trồng qua hình ảnh, quản lý thông tin cây, chia sẻ kinh nghiệm chăm sóc và kết nối cộng đồng yêu cây.
DocPlant không chỉ hỗ trợ nhận diện và quản lý cây ngoài trời mà còn đặc biệt hữu ích cho người trồng cây cảnh trong nhà. Ứng dụng cung cấp các gợi ý chăm sóc tổng quan phù hợp với điều kiện: như yêu cầu ánh sáng, tần suất tưới cơ bản,độ ẩm và thông thoáng. Những thông tin này mang tính hướng dẫn chung để người dùng dễ nắm bắt và thực hiện, giúp duy trì sức khỏe cây trong môi trường trong nhà mà không đi sâu vào các chỉ dẫn chuyên môn phức tạp.
1.2. Khảo sát nghiệp vụ
1.2.1. Mục tiêu và chức năng hệ thống
Mục tiêu chính: Phát triển một ứng dụng di động cho phép nhận diện cây, quản lý hồ sơ cây, cung cấp thông tin chăm sóc và kết nối cộng đồng.
Chức năng chính:
- Nhận diện bệnh của cây thông qua ảnh lá có dấu hiệu.
- Quản lý hồ sơ cây (tạo, sửa, xóa, lịch điều trị bệnh/lịch chăm sóc cây cảnh).
- Tạo bài đăng cộng đồng, bình luận và đánh giá.
- Xem bài viết chia sẻ nội dung, góc nhìn của chuyên gia/quản trị viên.
- Quản trị nội dung và xử lý báo cáo vi phạm.
1.2.2. Quy trình nghiệp vụ
a. Quy trình nhận diện cây:
Mục tiêu: Xác định chủng loại cây hoặc bệnh từ ảnh do người dùng cung cấp và trả về nhãn cùng chỉ số độ tin cậy.
Quy trình thực hiện:
- Người dùng chụp ảnh cây/lá hoặc chọn ảnh từ bộ sưu tập
- Ứng dụng tiền xử lý ảnh (cắt, thay đổi kích thước, chuẩn hoá) để phù hợp với mô hình nhận diện trên thiết bị.
- Ứng dụng tải/khởi tạo mô hình TFLite (hoặc sử dụng mô-đun suy luận) và chạy suy luận trên ảnh đã chuẩn hóa.
- Hệ thống nhận về kết quả: tên loại/bệnh, xác suất/độ tin cậy, và (nếu có) mức độ nghiêm trọng.
- Hiển thị kết quả cho người dùng kèm gợi ý sơ bộ về chăm sóc hoặc hành động tiếp theo.
- Lưu kết quả (kèm ảnh, thời điểm, meta dữ liệu) vào lịch sử quét để truy xuất và thống kê sau này.
b. Quy trình quản lý lịch trình điều trị/chăm sóc: 
Mục tiêu: Tạo, theo dõi và hoàn thành các lịch chăm sóc, chữa trị dựa trên kết quả nhận diện hoặc thao tác thủ công.
Quy trình thực hiện:
- Người dùng tạo lịch từ kết quả nhận diện hoặc thủ công bằng cách chọn loại bệnh/chăm sóc và thời gian thực hiện.
- Hệ thống lưu lịch với các trường: cây liên quan, mô tả công việc, ngày/giờ, mức độ lặp lại (nếu có), người chịu trách nhiệm.
- Người dùng có thể xem danh sách lịch, lọc theo ngày hoặc loại và mở chi tiết từng lịch.
- Người dùng cập nhật trạng thái (đã hoàn thành, hoãn, hủy) và có thể ghi chú kết quả sau khi thực hiện.
- Hệ thống gửi thông báo nhắc thực hiện theo lịch và đồng bộ trạng thái trên mọi thiết bị của người dùng.
c. Quy trình tương tác cộng đồng: 
Mục tiêu: Cho phép người dùng tạo, chia sẻ nội dung, tương tác và hỗ trợ lẫn nhau.
Quy trình thực hiện: 
- Tạo bài viết: Người dùng soạn nội dung, đính kèm ảnh, chọn thẻ liên quan và đăng bài.
- Hiển thị bài viết: Danh sách bài viết được hiển thị theo thời gian, lượt tương tác hoặc bài nổi bật.
- Tương tác: Người dùng like, comment, chia sẻ bài viết; bình luận có thể kèm ảnh hoặc liên kết.
- Báo cáo: Người dùng có thể báo cáo bài viết hoặc bình luận vi phạm nội quy.
- Lưu trữ và thông báo: Tất cả tương tác được lưu để hiển thị lịch sử và gửi thông báo cho tác giả khi có tương tác.
d. Quy trình quản trị: 
Mục tiêu: Quản lý nội dung, xử lý báo cáo, quản lý người dùng và cung cấp báo cáo thống kê.
Bước thực hiện:
- Admin duyệt các báo cáo và bài viết bị báo; có thể phê duyệt, xóa hoặc chỉnh sửa nội dung.
- Xử lý report: Admin xem nội dung báo cáo, quyết định biện pháp (cảnh cáo, gỡ bài, khoá user).
- Quản lý user: Thay đổi vai trò, khoá/mở khoá tài khoản khi cần.
- Thống kê: Tạo báo cáo về hoạt động cộng đồng, số lần quét, các bệnh phổ biến và tần suất lịch chăm sóc để hỗ trợ ra quyết định.
- Ghi nhật ký hành động quản trị để phục vụ tra soát.
1.3. Khảo sát một số website/app liên quan
1.3.1. PlantNet Plant Identification
PlantNet là một nền tảng nhận diện thực vật dựa trên việc kết hợp đóng góp từ cộng đồng và các mô hình học máy. Người dùng có thể gửi ảnh lá, hoa hoặc toàn cây qua ứng dụng di động hoặc trang web; hệ thống sẽ so sánh ảnh với cơ sở dữ liệu lớn và trả về các đề xuất về loài cùng thông tin phân loại cơ bản. Dữ liệu thu thập từ người dùng cũng được sử dụng để cải thiện mô hình và phục vụ nghiên cứu khoa học, góp phần xây dựng một kho dữ liệu thực vật công khai theo hướng citizen science.
 
Hình 1.1. Giao diện ứng dụng PlantNet Plant Identification
Điểm mạnh:
- Cộng đồng lớn và năng động, giúp tăng độ phủ và tính đa dạng của dữ liệu ảnh (nhiều vùng địa lý, mùa vụ khác nhau).
- Cơ sở dữ liệu phong phú, liên tục được mở rộng nhờ đóng góp người dùng, nâng cao khả năng nhận diện cho nhiều loài.
- Mô hình và quy trình xác thực kết hợp giữa tự động và kiểm duyệt cộng đồng giúp cải thiện chất lượng kết quả theo thời gian.
- Giá trị khoa học cao: dữ liệu được sử dụng cho nghiên cứu sinh thái, bảo tồn và phân bố loài.
1.3.2. PictureThis
PictureThis là một ứng dụng thương mại sử dụng mô hình học máy để nhận diện cây và cung cấp gợi ý chăm sóc chuyên biệt dành cho người dùng tiêu dùng. Bên cạnh chức năng nhận dạng, ứng dụng tích hợp nội dung hướng dẫn chăm sóc tối ưu hóa theo từng loài, gợi ý sản phẩm (phân bón, thuốc, đất trồng) và các dịch vụ trả phí như tư vấn chuyên gia hoặc thiết lập lịch chăm sóc tự động. 
 
Hình 1.2. Giao diện ứng dụng PictureThis
Điểm mạnh: 
- Gợi ý chăm sóc cụ thể: cung cấp khuyến nghị thực tế (ánh sáng, tưới, dinh dưỡng cơ bản) và đề xuất sản phẩm phù hợp giúp người dùng hành động dễ dàng.
- Trải nghiệm người dùng thương mại thân thiện: UI/UX tối ưu cho việc mua sắm, tìm kiếm sản phẩm và đặt dịch vụ (thanh toán, lịch hẹn).
- Cá nhân hoá: đề xuất dựa trên lịch sử cây, điều kiện môi trường và phản hồi của người dùng giúp tăng hiệu quả chăm sóc.
- Mô hình kiểm soát chất lượng dữ liệu: dữ liệu huấn luyện và gợi ý có thể được hiệu chỉnh bởi chuyên gia, giảm rủi ro khuyến nghị sai.
- Tiềm năng doanh thu: kết hợp thương mại (affiliate, in-app purchase, tư vấn trả phí) giúp duy trì và phát triển dịch vụ.
1.3.3. iNaturalist
iNaturalist là một nền tảng khoa học công dân tập trung vào ghi nhận và theo dõi đa dạng sinh học. Người dùng có thể tải ảnh quan sát (thực vật, động vật, nấm, v.v.), hệ thống sẽ hỗ trợ nhận diện ban đầu và cộng đồng cùng các chuyên gia sẽ xác thực hoặc đề xuất chỉnh sửa nhãn. Dữ liệu thu thập được tích hợp vào các dự án nghiên cứu, bản đồ phân bố loài và cơ sở dữ liệu mở cho cộng đồng khoa học.
 
Điểm mạnh: 
- Tính khoa học cao: dữ liệu được sử dụng rộng rãi cho nghiên cứu sinh thái, bảo tồn và bản đồ phân bố loài.
- Cộng đồng đa dạng: nhiều chuyên gia và người dùng đóng góp xác thực giúp nâng cao độ chính xác nhãn.
- Hỗ trợ nhiều nhóm sinh vật (không chỉ cây) và cung cấp ngữ cảnh địa lý, thời gian cho mỗi quan sát.
- Tính minh bạch dữ liệu: quan sát thường có lịch sử xác thực, nguồn và có thể truy xuất để tái sử dụng nghiên cứu.
- Tích hợp với các dự án và cơ sở dữ liệu khác (ví dụ GBIF), tăng khả năng ứng dụng học thuật.
1.4. Hình thành ý tưởng thiết kế hệ thống DocPlant
1.4.1. Yêu cầu chức năng
CÁC CHỨC NĂNG VỊ TRÍ QUẢN TRỊ VIÊN
STT	Chức năng	Mô tả
1	Quản lý người dùng	Xem, khóa, phân quyền và quản lý tài khoản người dùng.
2	Duyệt/Quản lý bài viết	Duyệt, ẩn, xóa hoặc phục hồi bài viết
3	Xử lý báo cáo	Xem danh sách báo cáo, xử lý hoặc chuyển tiếp cho các hành động tiếp theo.
4	Quản lý nội dung	Thêm/Sửa/Xóa các mục dữ liệu (cây cảnh, hướng dẫn chăm sóc, thông tin về bệnh, mẫu lịch trình chữa bệnh).
5	Thông báo	Tạo thông báo tới người dùng cụ thể hoặc tới toàn bộ người dùng.
Bảng 1.1. Bảng yêu cầu chức năng quản trị viên
CÁC CHỨC NĂNG CỦA VỊ TRÍ NGƯỜI DÙNG
STT	Chức năng	Mô tả
1	Đăng ký/Đăng nhập	Đăng ký tài khoản, đăng nhập bằng email và mật khẩu.
2	Nhận diện cây	Tải lên/chụp ảnh để nhận diện loài, hiển thị kết quả và gợi ý chăm sóc.
3	Quản lý lịch chăm sóc cây	Tạo, xem, chỉnh sửa, xoá lịch trình chăm sóc và ghi chú.
4	Tương tác cộng đồng	Tạo bài viết, bình luận, like, chia sẻ và báo cáo bài viết.
5	Thông báo & Lịch	Nhận thông báo nhắc nhở lịch tưới/bón phân.
6	Thời tiết	Xem dự báo thời tiết, gợi ý chăm sóc theo thời tiết
7	Tìm kiếm	Tìm bệnh, cây theo từ khóa, tag, hoặc loài cây.
8	Tạo blog	Tạo blog kiến thức/chia sẻ kinh nghiệm cá nhân (Đối với người dùng được phân quyền chuyên gia – expert)
9	Báo cáo	Tạo báo cáo đối với các bài viết, blog có nội dung chưa chính xác hoặc là vi phạm tiêu chuẩn.
10	Chủ đề và ngôn ngữ	Thay đổi màu chủ đề/ngôn ngữ của ứng dụng.
Bảng 1.2. Bảng yêu cầu chức năng người dùng
1.4.2. Yêu cầu phi chức năng
1.4.2.1. Môi trường và nền tảng phát triển
Ứng dụng di động: React Native (JavaScript/TypeScript) để hỗ trợ Android/iOS.
Backend: Node.js cho image-upload-server/ API.
Cơ sở dữ liệu: Firebase Firestore cho dữ liệu NoSQL;
ML model: TensorFlow Lite cho inference trên thiết bị (on-device).
Công cụ & kiểm thử: Jest, Metro, Chrome DevTools; CI/CD có thể là GitHub Actions.
1.4.2.2. Tính bảo mật và an toàn hệ thống (bảo vệ dữ liệu, xác thực người dùng)
Mã hoá & truyền tải: Sử dụng HTTPS cho mọi kết nối; mã hoá dữ liệu khi lưu trữ các trường nhạy cảm.
Xác thực: Firebase Authentication và OAuth cho đăng nhập.
Quyền truy cập: Thiết lập Firebase Security Rules cho Firestore/Storage để hạn chế quyền đọc/ghi.
Bảo mật model: Hạn chế việc lộ model và endpoint E2E; xác thực cho các API inference.
Sao lưu & phục hồi: Thiết lập cơ chế backup dữ liệu định kỳ và recovery plan.
 
CHƯƠNG 2: TÌM HIỂU VỀ CÔNG CỤ PHÁT TRIỂN HỆ THỐNG
2.1. Tổng quan về ngôn ngữ lập trình JavaScript và TypeScript
2.1.1. Giới thiệu về JavaScript và TypeScript
JavaScript là một ngôn ngữ lập trình rất phổ biến trên thế giới, được sử dụng để tạo ra các trang web, ứng dụng di động và cả các chương trình chạy trên máy chủ. Khi bạn sử dụng các trang web hiện đại, như Facebook, Google, hay các ứng dụng điện thoại, rất nhiều chức năng bạn thấy đều được xây dựng bằng JavaScript.
JavaScript có cú pháp đơn giản, dễ học, phù hợp cho cả người mới bắt đầu. Nó cho phép lập trình viên tạo ra các hiệu ứng động, xử lý dữ liệu, giao tiếp với máy chủ và nhiều chức năng khác.
TypeScript là một phiên bản nâng cao của JavaScript, do Microsoft phát triển. TypeScript bổ sung thêm các quy tắc kiểm tra lỗi và giúp lập trình viên kiểm soát tốt hơn khi xây dựng các ứng dụng lớn, phức tạp. TypeScript được thiết kế để dễ dàng chuyển đổi sang JavaScript, nên mọi nơi dùng JavaScript đều có thể dùng TypeScript.
2.1.2. Ưu điểm khi sử dụng JavaScript/TypeScript trong phát triển ứng dụng đa nền tảng
JavaScript và TypeScript đều có thể sử dụng để xây dựng ứng dụng cho nhiều nền tảng khác nhau như web, điện thoại, máy tính bảng, và cả máy chủ. Điều này giúp tiết kiệm thời gian và công sức vì chỉ cần học một ngôn ngữ là có thể làm được nhiều loại ứng dụng.
Cộng đồng sử dụng JavaScript/TypeScript rất lớn, có nhiều tài liệu, hướng dẫn, và thư viện hỗ trợ miễn phí, giúp người mới dễ dàng học và phát triển sản phẩm.
TypeScript giúp phát hiện lỗi sớm trong quá trình viết mã, giảm nguy cơ xảy ra lỗi khi ứng dụng hoạt động, giúp sản phẩm ổn định hơn.
Khi sử dụng JavaScript/TypeScript, các lập trình viên có thể dễ dàng làm việc nhóm, chia sẻ mã nguồn, và mở rộng ứng dụng khi cần thiết.
Các công nghệ hiện đại như React, React Native, Node.js đều hỗ trợ tốt JavaScript/TypeScript, giúp xây dựng giao diện đẹp, tốc độ nhanh và trải nghiệm người dùng tốt.
Tóm lại, JavaScript và TypeScript là lựa chọn lý tưởng để phát triển các ứng dụng hiện đại, đa nền tảng, phù hợp cho cả người mới bắt đầu và các dự án lớn.
2.2. Giới thiệu về React Native
2.2.1. React Native là gì?
React Native là một nền tảng phát triển ứng dụng di động do Facebook phát triển. Điểm đặc biệt của React Native là cho phép lập trình viên sử dụng JavaScript hoặc TypeScript để xây dựng các ứng dụng chạy trên cả điện thoại Android và iOS.
Thay vì phải học hai ngôn ngữ khác nhau cho hai hệ điều hành, React Native giúp bạn chỉ cần viết một lần, ứng dụng sẽ hoạt động trên nhiều thiết bị. Điều này giúp tiết kiệm thời gian, chi phí và công sức cho cả cá nhân và doanh nghiệp.
2.2.2. Kiến trúc và các thành phần chính của React Native
React Native được xây dựng dựa trên ý tưởng “component” (thành phần). Mỗi thành phần là một phần nhỏ của giao diện, ví dụ như nút bấm, ô nhập liệu, hình ảnh, v.v. Các thành phần này có thể kết hợp lại để tạo thành một ứng dụng hoàn chỉnh.
Kiến trúc của React Native gồm ba phần chính:
- Giao diện người dùng (UI): Được xây dựng từ các component, giúp tạo ra các màn hình, nút bấm, danh sách, hình ảnh… giống như ứng dụng gốc.
- Logic xử lý: Quản lý dữ liệu, xử lý sự kiện, kết nối với máy chủ hoặc các dịch vụ bên ngoài.
- Kết nối với hệ điều hành: React Native chuyển đổi mã JavaScript thành mã gốc của Android/iOS, giúp ứng dụng hoạt động mượt mà như các ứng dụng được viết bằng ngôn ngữ gốc.
Trong DocPlant, cấu trúc source code được tổ chức theo mô hình component và domain rõ ràng:
- Điểm khởi đầu (App.js): Khởi tạo NavigationContainer, đăng ký các context như ThemeContext/LanguageContext, và bọc toàn bộ ứng dụng bằng Redux Provider (store). Đây là nơi cấu hình các provider toàn cục và logic khởi tạo (ví dụ: khởi tạo Firebase, load fonts, kiểm tra auth).
- Điều hướng (src/navigation/): 
•	AppNavigator.js: cấu trúc điều hướng cấp cao.
•	MainTabs.js: thanh tab chính của ứng dụng.
•	Các stack theo tính năng: Bao gồm các stack như HomeStack.js, CommunityStack.js, ProfileStack.js, ScanStack.js, AuthStack.js và AdminStack.js, …. Mỗi stack chứa route và các transition phù hợp cho từng luồng người dùng.
- Màn hình (src/screens/):
•	Tổ chức theo domain: Community/, Home/, Scan/, Profile/, Admin/, Auth/, PlantCare/, Notes/, ...
•	Ví dụ: src/screens/Community/CreateArticleScreen.js (người dùng tạo bài), src/screens/Scan/ScanScreen.js (giao diện chụp/scan, gọi service TFLite).
•	Màn hình thường giữ logic UI; gọi service, hook hoặc action redux để thao tác dữ liệu.
- Component tái sử dụng (src/components/):
•	Chia nhỏ thành common/, forms/, ui/ để lưu các component như button, input, modal, image uploader, card hiển thị cây, danh sách bài viết.
•	Component giữ trạng thái cục bộ tối thiểu; nhận props và callbacks để tái sử dụng.
- Services / API (src/services/):
•	Chứa các modules xử lý tương tác với backend và tài nguyên: Một  file firestoreService.js tổng gọi các file service phụ cho các chức năng (như firestoreCommentService.js, firestoreUserService.js), authService.js, tfliteService.js (suy luận mô hình trên thiết bị), shareService.js, plantScheduleService.js, seedService.js.
•	Mục tiêu: tách riêng logic truy cập dữ liệu/IO khỏi UI, dễ dàng mock khi test.
•	Ngoài ra có thư mục dự án phụ FirebaseAdmin để scripts phía server (ví dụ seed data, xử lý batch).
- Quản lý State thông qua Redux (src/redux/):
•	store.js, rootReducer.js, thunkUtils.js và slices/ chứa các feature slices (ví dụ authSlice, communitySlice, scanSlice, plantSlice).
•	Middleware trong redux/middleware/ dùng cho logging, error handling hoặc side-effects.
•	Patterns: actions gọi services (thunks) -> cập nhật slice -> UI subscribe.
- Hooks tùy chỉnh (src/hooks/): Hooks như useAdmin.js, useChatbot.js, useAppInitialization.js, useDiseaseSearch.js, usePlantCare.js dùng để đóng gói logic phức tạp (fetching, polling, debouncing) và tái sử dụng trong screens.
- Utils & Helpers (src/utils/): Các hàm tiện ích: format date/time, image normalization cho TFLite, validation, xử lý localisation, constants helper. Dễ mock trong tests.
- Theme & Locales (src/theme/, src/locales/): theme chứa màu, kích thước, style constants; locales chứa bản dịch (ví dụ en/, vi/) và helper LanguageContext để chuyển đổi ngôn ngữ.
- Assets & Data mẫu (src/assets/ và assets root): Chứa các file dữ liệu mẫu như sampledisease.json, newArticleCollection.json. data có scripts seed (treatmentTemplates.js, preventTemplate.js).
Kỹ thuật xử lý ảnh & Scan:
- Khi người dùng chụp hoặc chọn ảnh, các bước chính gồm: thay đổi kích thước → cắt → nén → tiền xử lý phía ứng dụng → tải lên / dự đoán trên thiết bị (TFLite).
- Thư viện được sử dụng: react-native-image-picker để chọn ảnh; react-native-camera/react-native-vision-camera cho tính năng scan trực tiếp.
Hiệu năng & tối ưu:
- Dùng React.memo cho component tĩnh tránh re-render không cần thiết.
- Dùng useCallback & useMemo tối ưu các callback và giá trị phức tạp.
- Sử dụng FlatList/SectionList có keyExtractor và pagination cho danh sách cộng đồng.
2.2.3. Lợi ích khi sử dụng React Native cho DocPlant
- Tiết kiệm thời gian và chi phí: Chỉ cần viết một lần, ứng dụng chạy được trên cả Android và iOS.
- Dễ dàng cập nhật và bảo trì: Khi cần sửa lỗi hoặc thêm tính năng, chỉ cần chỉnh sửa một nơi, không phải làm lại cho từng hệ điều hành.
- Hiệu suất tốt: Ứng dụng React Native có tốc độ và trải nghiệm gần giống như ứng dụng gốc.
- Cộng đồng lớn: Có nhiều tài liệu, thư viện hỗ trợ, giúp việc phát triển nhanh chóng và dễ dàng hơn.
- Tích hợp dễ dàng với các dịch vụ như Firebase, camera, bản đồ…
- Nhờ những lợi ích này, DocPlant có thể phát triển nhanh, dễ mở rộng và mang lại trải nghiệm tốt cho người dùng trên nhiều thiết bị khác nhau.
2.3. Quản lý trạng thái với Redux
2.3.1. Redux là gì?
Redux là một thư viện giúp quản lý trạng thái (dữ liệu) của ứng dụng một cách rõ ràng và hiệu quả. Trong các ứng dụng hiện đại, dữ liệu có thể thay đổi liên tục khi người dùng thao tác, ví dụ như đăng nhập, thêm cây trồng, bình luận… Nếu không quản lý tốt, dữ liệu sẽ dễ bị rối, gây lỗi hoặc khó bảo trì.
Redux giúp lưu trữ toàn bộ trạng thái của ứng dụng ở một nơi duy nhất gọi là “store”. Khi dữ liệu thay đổi, Redux sẽ cập nhật lại giao diện một cách tự động và nhất quán.
2.3.2. Cách Redux hoạt động trong DocPlant
Trong DocPlant, Redux được sử dụng để quản lý các dữ liệu như thông tin người dùng, danh sách cây trồng, bài viết cộng đồng, trạng thái đăng nhập…
Khi người dùng thực hiện một hành động (ví dụ: thêm cây mới), Redux sẽ nhận thông tin này và cập nhật lại “store”.
Các thành phần giao diện sẽ tự động nhận dữ liệu mới từ “store” và hiển thị lên màn hình.
Nhờ vậy, dữ liệu luôn đồng bộ giữa các màn hình, giúp ứng dụng hoạt động ổn định và dễ kiểm soát.
Luồng hoạt động cụ thể:
- Khi người dùng thực hiện hành động (ví dụ: thêm bệnh mới), component dispatch một action (ví dụ: addDisease), middleware sẽ bắt và thực hiện gọi API/Firestore.
- Sau khi API trả về, reducer sẽ cập nhật store (ví dụ: diseaseSlice) với dữ liệu mới.
- Các component lắng nghe state thay đổi và render lại dữ liệu tương ứng.
File tham khảo trong repo:
- src/redux/store.js - cấu hình store, middleware, và devtools.
- src/redux/slices/ - chứa slice files như userSlice.js, plantSlice.js, postSlice.js.
- src/redux/thunkUtils.js - các helper xử lý call API bất đồng bộ, retry và xử lý lỗi.
2.3.3. Middleware và các slice trong Redux
Middleware: Là các đoạn mã giúp xử lý các tác vụ đặc biệt như gọi API, kiểm tra dữ liệu, ghi log… trước khi dữ liệu được cập nhật vào “store”. Ví dụ, khi người dùng đăng nhập, middleware sẽ kiểm tra thông tin với máy chủ trước khi lưu trạng thái đăng nhập.
Slice: Là cách chia nhỏ “store” thành các phần riêng biệt, mỗi phần quản lý một loại dữ liệu (ví dụ: slice người dùng, slice cây trồng, slice bài viết…). Điều này giúp mã nguồn dễ tổ chức, dễ bảo trì và mở rộng.
Tóm lại: Redux giúp DocPlant quản lý dữ liệu một cách khoa học, đảm bảo ứng dụng luôn hoạt động ổn định, dễ phát triển thêm tính năng mới và sửa lỗi khi cần thiết.
2.4. Tích hợp Firebase vào hệ thống
2.4.1. Firebase là gì?
Firebase là một nền tảng do Google phát triển, cung cấp nhiều dịch vụ hỗ trợ xây dựng ứng dụng hiện đại như lưu trữ dữ liệu, xác thực người dùng, lưu trữ hình ảnh, gửi thông báo, v.v.
Firebase giúp lập trình viên không cần tự xây dựng máy chủ phức tạp mà vẫn có thể tạo ra các chức năng mạnh mẽ cho ứng dụng.
2.4.2. Các dịch vụ Firebase sử dụng trong DocPlant (Authentication, Firestore, Storage, v.v.)
Authentication (Xác thực người dùng): Giúp người dùng đăng ký, đăng nhập, bảo vệ tài khoản bằng email, số điện thoại hoặc tài khoản Google/Facebook.
Firestore (Cơ sở dữ liệu): Lưu trữ thông tin cây trồng, bài viết, bình luận, lịch sử chăm sóc… Dữ liệu được lưu dưới dạng “collection” và “document”, dễ dàng truy xuất và cập nhật.
Các dịch vụ khác: Có thể sử dụng thêm các dịch vụ như gửi thông báo (Cloud Messaging), phân tích dữ liệu sử dụng (Analytics)…
2.4.3. Quy trình tích hợp Firebase với React Native
Cài đặt các thư viện Firebase vào dự án React Native.
Kết nối ứng dụng với tài khoản Firebase để sử dụng các dịch vụ như xác thực, lưu trữ dữ liệu, hình ảnh. Trong DocPlant, các file cấu hình và helper thường nằm ở src/firebase/config.js và src/services/firebase.js (để trừu tượng hóa các thao tác với Firebase).
Khi người dùng thao tác (đăng nhập, thêm cây, đăng bài…), ứng dụng sẽ gửi dữ liệu lên Firebase và nhận lại kết quả để hiển thị lên màn hình. Các thực tiễn thường dùng:
- Sử dụng onSnapshot để cập nhật theo thời gian thực trong màn hình Cộng đồng / Bảng tin.
- Dùng batch write khi cần insert/update nhiều document liên quan để đảm bảo atomic.
- Cấu trúc collection mẫu:
o	users/{userId}: profile, settings, roles
o	plants/{plantId}: name, images[], ownerId, careSchedule[]
o	posts/{postId}: title, sections[], authorId, createdAt
o	comments/{commentId}: postId, authorId, content
o	reports/{reportId}: contentId, reporterId, status
Chú ý về bảo mật: viết Firestore Rules để giới hạn quyền đọc/ghi (ví dụ: user chỉ được sửa users/{userId} của mình; admin có thể thao tác reports).
Firebase đảm bảo dữ liệu luôn được đồng bộ, bảo mật và dễ dàng mở rộng khi cần thiết.
2.5. Xây dựng backend với Node.js (image-upload-server)
2.5.1. Tổng quan về Node.js
Node.js là một nền tảng giúp lập trình viên xây dựng các ứng dụng máy chủ (backend) bằng ngôn ngữ JavaScript. Nhờ Node.js, bạn có thể tạo ra các dịch vụ như lưu trữ dữ liệu, xử lý hình ảnh, xác thực người dùng… một cách nhanh chóng và hiệu quả. Node.js nổi bật với khả năng xử lý nhiều yêu cầu cùng lúc, phù hợp cho các ứng dụng hiện đại như DocPlant.
2.5.2. Kiến trúc backend và API phục vụ DocPlant
Backend của DocPlant được xây dựng bằng Node.js, đóng vai trò là “bộ não” xử lý các yêu cầu từ ứng dụng.
Backend cung cấp các API (giao diện lập trình ứng dụng) để ứng dụng di động có thể gửi dữ liệu, nhận kết quả, ví dụ như tải lên hình ảnh cây trồng, lấy thông tin cây, quản lý người dùng…
Kiến trúc backend thường gồm các phần: xử lý yêu cầu, xác thực người dùng, lưu trữ dữ liệu, xử lý hình ảnh (image-upload-server), và trả kết quả về cho ứng dụng.
2.5.3. Giao tiếp giữa frontend và backend
Frontend (ứng dụng di động) và backend (máy chủ) giao tiếp với nhau qua các API. Khi người dùng thao tác trên ứng dụng, dữ liệu sẽ được gửi lên backend để xử lý, sau đó nhận lại kết quả để hiển thị.
Ví dụ: Khi người dùng tải lên ảnh cây trồng, ảnh sẽ được gửi đến backend, backend xử lý và lưu trữ, sau đó trả về kết quả nhận diện cho ứng dụng.
2.6. Thiết kế giao diện người dùng
2.6.1. Sử dụng các thư viện UI (React Native Paper, Native Base, v.v.)
Để xây dựng giao diện đẹp và chuyên nghiệp, DocPlant sử dụng các thư viện UI như React Native Paper, Native Base… Các thư viện này cung cấp sẵn các thành phần như nút bấm, biểu mẫu, danh sách, giúp lập trình viên thiết kế giao diện nhanh chóng, nhất quán và dễ sử dụng.
2.6.2. Tối ưu trải nghiệm người dùng trên đa nền tảng
DocPlant được thiết kế để hoạt động tốt trên nhiều thiết bị khác nhau (Android, iOS). Giao diện được tối ưu để dễ thao tác, hiển thị rõ ràng, tốc độ phản hồi nhanh, giúp người dùng có trải nghiệm tốt nhất dù sử dụng điện thoại nào.
2.7. Công cụ phát triển và kiểm thử
2.7.1. Sử dụng Jest cho kiểm thử
Jest là một công cụ kiểm thử tự động dành cho JavaScript/TypeScript. Lập trình viên sử dụng Jest để kiểm tra các chức năng của ứng dụng, đảm bảo mọi tính năng hoạt động đúng như mong đợi, phát hiện lỗi sớm trước khi phát hành sản phẩm.
2.7.2. Công cụ debug và phát triển (Metro, Chrome DevTools, v.v.)
Trong quá trình phát triển, các công cụ như Metro (trình biên dịch cho React Native), Chrome DevTools (công cụ kiểm tra và sửa lỗi), giúp lập trình viên dễ dàng phát hiện và sửa lỗi, kiểm tra giao diện, tối ưu hiệu suất ứng dụng.
Nhờ các công cụ này, quá trình phát triển DocPlant trở nên nhanh chóng, hiệu quả và đảm bảo chất lượng sản phẩm.
 
CHƯƠNG 3: PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG DOCPLANT
3.1. Phân tích hệ thống DocPlant
3.1.1. Biểu đồ ca sử dụng (Use Case Diagram)
Các actor chính của hệ thống:
- Guest (Khách)
- User (Người dùng)
- Admin (Quản trị viên)
- System / Backend
STT	Use case	Actor	Mô tả ngắn
1	Đăng ký / Đăng nhập	Guest	Đăng ký tài khoản, đăng nhập, xác thực phương thức (email/Google/FB)
2	Nhận diện cây	User	Upload/Scan hình ảnh để nhận diện loài và gợi ý xử lý
3	Quản lý hồ sơ cây	User	CRUD hồ sơ cây, lịch chăm sóc và xem lịch sử
4	Tạo bài viết	Contributor	Tạo bài dạng nhiều phần, upload ảnh, tag và chia sẻ
5	Tương tác cộng đồng	User/Guest	Bình luận, like, báo cáo nội dung
6	Quản trị & Duyệt	Admin	Duyệt/ẩn/bỏ xoá bài viết, quản lý người dùng và xử lý báo cáo
7	Hệ thống xử lý ảnh	System	Tiền xử lý ảnh, lưu ảnh và metadata (inference thực hiện on-device bằng TFLite)

3.1.2. Các luồng nghiệp vụ chính
3.2. Tổng quan các chức năng của hệ thống
3.2.1. Chức năng đăng ký, đăng nhập, đăng xuất tài khoản
  - Đăng ký tài khoản
  - Đăng nhập
  - Đăng xuất
3.2.2. Chức năng dành cho người dùng
  - Nhận diện cây trồng qua hình ảnh
  - Quản lý thông tin cây trồng
  - Quản lý lịch sử chăm sóc cây
  - Tìm kiếm, tra cứu thông tin cây
  - Tham gia cộng đồng, đăng bài, bình luận
3.2.3. Chức năng dành cho quản trị viên
  - Quản lý người dùng
  - Quản lý bài viết, bình luận
  - Quản lý dữ liệu cây trồng
  - Quản lý báo cáo, thống kê
3.2.4. Chức năng tích hợp dịch vụ (Firebase, backend Node.js)
  - Xác thực người dùng
  - Lưu trữ dữ liệu
  - Quản lý hình ảnh
3.3. Thiết kế cơ sở dữ liệu hệ thống
3.3.1. Biểu đồ lớp (Class Diagram)
3.3.2. Thiết kế các collection dữ liệu chính
  - Bảng người dùng
  - Bảng cây trồng
  - Bảng lịch sử chăm sóc
  - Bảng bài viết, bình luận
  - Bảng quản trị viên
3.4. Thiết kế giao diện và kiến trúc hệ thống
3.4.1. Thiết kế giao diện người dùng (UI/UX)
3.4.2. Kiến trúc hệ thống (Frontend, Backend, Database, Firebase) 
CHƯƠNG 4: TRIỂN KHAI XÂY DỰNG HỆ THỐNG 
4.1. Cấu trúc xây dựng hệ thống
Sau khi phân tích và thiết kế hệ thống website tuyển dụng tìm kiếm việc làm, em đã lựa chọn ngôn ngữ lập trình java làm ngôn ngữ phát triển hệ thống kết hợp sử dụng modul phát triển web spring MVC trong hệ sinh thái framework spring để xây dựng và phát triển website tuyển dụng tìm kiếm việc làm dựa trên các thành phần chính như sau.

Hình 4.0. Cấu trúc thư mục hệ thống 
4.1.1. Các lớp trong phần domain
Trong thư mục domain chứa các lớp model dùng để quản lý lưu trữ dữ liệu với cấu trúc và các thuộc tính được ánh xạ từ các bảng trong cơ sở dữ liệu đảm bảo toàn bộ logic nghiệp vụ của ứng dụng được thực thi đúng cách. Điều này giúp dự án dễ bảo trì, mở rộng, và đảm bảo tách biệt các nhiệm vụ của từng thành phần trong kiến trúc MVC.

Hình 4.1. Model User tương ứng với bảng tbl_user
4.1.2. Các lớp trong phần repository
Trong thư mục repository chứa các interface là một phần quan trọng khi làm việc với dữ liệu. Nó thuộc tầng dữ liệu (Data Access Layer) và được sử dụng để giao tiếp với cơ sở dữ liệu thông qua các phương thức truy xuất dữ liệu.

Hình 4.2. Các phương thức truy xuất dữ liệu trong UserRepository
4.1.3. Các lớp trong phần service

Hình 4.3. Lớp UserService
Thư mục service là thành phần nằm giữa Controller và Repository chứa các lớp có nhiệm vụ xử lý logic nghiệp vụ của ứng dụng. Service giúp tách biệt các phần nghiệp vụ phức tạp ra khỏi Controller và Repository, tạo nên một hệ thống dễ quản lý, bảo trì và mở rộng.
4.1.4. Các lớp trong phần controller

Hình 4.4.  Lớp UserController
Thư mục controller chứa các lớp có nhiệm vụ xử lý các yêu cầu và điều hướng các trang chính trên website, đóng vai trò trung gian giữa người dùng và các tầng logic nghiệp vụ (Service) hoặc dữ liệu (Repository). Controller chịu trách nhiệm xử lý các yêu cầu từ phía người dùng và trả về phản hồi phù hợp.
4.1.5. Các tệp thư mục trong phần webapp
Trong thư mục webapp chứa các thư mục và file thành phần chịu trách nhiệm hiển thị dữ liệu và tương tác với người dùng. View đóng vai trò cung cấp giao diện để người dùng có thể thực hiện các thao tác với hệ thống, nhận dữ liệu đầu vào, và hiển thị kết quả được xử lý từ các tầng khác.

Hình 4.5. Tệp show.jsp xử lý hiển thị giao diện trang chủ
4.2. Triển khai giao diện website
4.2.1. Giao diện dùng chung
4.2.1.1. Giao diện trang đăng nhập

Hình 4.6. Giao diện trang đăng nhập
Giao diện trang đăng nhập hệ thống được thể hiện trong Hình 4.6. Sau khi người dùng nhập thông tin đăng nhập và nhấn nút “Đăng nhập”, hệ thống sẽ dựa vào phân quyền của tài khoản và chuyển người dùng đến giao diện tương ứng theo quyền sử dụng.
4.2.1.2. Giao diện trang việc làm

Hình 4.7. Giao diện trang việc làm
Giao diện trang việc làm được thể hiện trong hình 4.7, khi người dùng truy cập vào trang việc làm có thể xem được các bài đăng tuyển dụng nổi bật, người dùng có thể tích vào các ô tiêu chí bên phần chức năng bộ lọc nhấn vào nút “lọc kết quả” hệ thống sẽ hiển thị kết quả các bài tuyển dụng được lọc theo yêu cầu của người dùng.
4.2.1.3. Giao diện trang công ty
Giao diện trang công ty được thể hiện trong hình 4.8, khi người dùng truy cập vào trang công ty có thể xem được các nhà tuyển dụng nổi bật.

Hình 4.8. Giao diện trang công ty
4.2.1.4. Giao diện trang bài viết
Giao diện trang bài viết được thể hiện trong hình 4.9, khi người dùng truy cập vào trang việc làm có thể xem được các bài viết theo các chủ đề hỗ trợ định hướng nghề nghiệp và việc làm.

Hình 4.9. Giao diện trang bài viết
4.2.1.5. Giao diện trang chi tiết việc làm
Giao diện trang chi tiết việc làm được thể hiện trong hình 4.10, khi người dùng truy cập vào trang chi tiết việc làm có thể xem được nội dung yêu cầu của các nhà tuyển dụng. Người dùng có thể nhập các thông tin ứng tuyển vào form phía dưới phần nội dung tuyển dụng.

Hình 4.10. Giao diện trang chi tiết việc làm
4.2.2. Giao diện dành cho vị trí nhà tuyển dụng
4.2.2.1. Giao diện trang thông tin tài khoản
Giao diện trang thông tin tài khoản được thể hiện trong hình 4.11, khi người dùng truy cập vào chức năng thông tin tài khoản có thể xem được thông tin tài khoản, người dùng có thể cập nhật thông tin người dùng và thông tin về công ty tuyển dụng nhấn nút “cập nhật thông tin” hệ thống sẽ kiểm tra lưu lại thông tin vào cơ sở dữ liệu.

Hình 4.11. Giao diện trang thông tin tài khoản
4.2.2.2. Giao diện trang tạo bài đăng tuyển dụng
Giao diện trang tạo bài đăng tuyển dụng được thể hiện trong hình 4.12, khi người dùng truy cập vào chức năng tạo bài đăng tuyển dụng cho phép người dùng nhập các thông tin bài tuyển dụng sau khi nhấn nút “gửi đăng bài” hệ thống sẽ kiểm tra thông tin người dùng nhập vào khi thông tin hợp lệ hệ thống tiến hành lưu thông tin vào cơ sở dữ liệu ở trạng thái “chờ phê duyệt”.

Hình 4.12. Giao diện trang tạo bài đăng tuyển dụng
4.2.2.3. Giao diện trang quản lý danh sách bài đăng tuyển dụng
Giao diện trang danh sách bài đăng tuyển dụng được thể hiện trong hình 4.13, khi người dùng truy cập vào trang danh sách bài đăng tuyển dụng người dùng có thể xem được danh sách các bài đăng tuyển dụng.

Hình 4.13. Giao diện trang danh sách bài đăng tuyển dụng
4.2.2.4. Giao diện trang quản lý danh sách ứng viên

Hình 4.14. Giao diện trang danh sách danh sách ứng viên
Giao diện trang danh sách ứng viên được thể hiện trong hình 4.14, khi người dùng truy cập vào trang danh sách ứng viên sẽ xem được danh sách các ứng viên, người dùng có thể xem thông tin hồ sơ ứng viên khi nhấp vào nút tác vụ “xem thông tin” hệ thống sẽ điều hướng người dùng đến trang phê duyệt hồ sơ ứng viên hình 4.15. Đồng thời người dùng có thể loại ứng viên khi chọn tác vụ “loại ứng viên”.

Hình 4.15. Giao diện trang phê duyệt hồ sơ ứng viên
4.2.3. Giao diện dành cho vị trí ứng viên
4.2.3.1. Giao diện trang việc làm yêu thích
Giao diện trang việc làm yêu thích được thể hiện trong hình 4.16, khi người dùng truy cập vào trang việc làm yêu thích có thể xem được danh sách các việc làm nổi bật được lưu lại, tai đây người dùng có thể xem thông tin chi tiết của bài đăng tuyển dụng khi nhấn vào nút “ứng tuyển” và có thể xóa việc làm khỏi mục yêu thích khi nhấn vào nút “xóa”.

Hình 4.16. Giao diện trang việc làm yêu thích
4.2.3.2. Giao diện trang lịch sử ứng tuyển
Giao diện trang lịch sử ứng tuyển được thể hiện trong hình 4.17, khi người dùng truy cập vào trang lịch sử ứng tuyển có thể xem được danh sách các việc làm mà ứng viên đã nộp hồ sơ ứng tuyển, tại đây người dùng có thể xem được thông tin việc làm đăng ứng tuyển khi chọn nút “xem chi tiết” và hủy ứng tuyển khi chọn nút “hủy ứng tuyển”.

Hình 4.17. Giao diện trang lịch sử việc làm ứng tuyển
4.2.3.3. Giao diện trang kết quả ứng tuyển

Hình 4.18. Giao diện trang kết quả ứng tuyển
Giao diện trang kết quả ứng tuyển được thể hiện trong hình 4.18, khi người dùng truy cập vào kết quả ứng tuyển có thể xem danh sách kết quả phản hồi của nhà tuyển dụng.
4.2.4. Một số giao diện dành cho vị trí quản trị viên
4.2.4.1. Giao diện trang quản lý tài khoản
Giao diện trang quản lý tài khoản được thể hiện trong hình 4.19, khi người dùng truy cập vào trang quản lý tài khoản có thể xem được danh sách các các tài khoản hệ thống, người dùng có thể thực hiện các tác vụ thêm sửa xóa thông tin tài khoản.

Hình 4.19. Giao diện trang quản lý tài khoản
4.2.4.2. Giao diện trang phê duyệt bài đăng tuyển dụng
Giao diện trang phê duyệt bài đăng tuyển dụng được thể hiện trong hình 4.20, khi người dùng truy cập vào trang phê duyệt bài đăng tuyển dụng có thể xem được danh sách các bài đăng tuyển dụng đang chờ phê duyệt, người dùng có thể thực hiện các tác phê duyệt đăng bài bằng cách chọn nút “đăng bài”, đồng thời có thể xóa bài đăng tuyển dụng khi chọn nút “xóa bài”.

Hình 4.20. Giao diện trang phê duyệt đăng bài
4.2.4.3. Giao diện trang quản lý dịch vụ
Giao diện trang quản lý dịch vụ được thể hiện trong hình 4.21, khi người dùng truy cập vào trang quản lý dịch vụ có thể xem được danh sách các gói dịch vụ cung cấp, người dùng có thể thêm gói dịch vụ mới khi chọn vào nút chức năng “thêm mới” hệ thống sẽ chuyển người dùng đến trang thêm mới gói dịch vụ, và có thể cập nhật thông tin gói dịch vụ khi chọn nút chức năng “cập nhật” hoặc thực hiện xóa gói dịch vụ bằng cách chọn vào nút “xóa”.

Hình 4.21. Giao diện trang quản lý dịch vụ
 
KẾT LUẬN 
Sau khoảng thời thời gian xây dựng đồ án tốt nghiệp với sự hướng dẫn và giúp tận tình từ thầy Hoàng Hữu Việt và các thầy cô trong khoa công nghệ thông tin và bạn bè em đã hoàn thành sản phẩm đồ án kịp tiến độ đáp ứng được những yêu cầu bài toán đề ra và có các kết quả cũng như hướng phát triển như sau: 
1. Kết quả đạt được 
-	Hiểu rõ và áp dụng thành thạo các kiến thức phát triển sản phẩm website tuyển dụng tìm kiếm việc làm phát triển với ngôn ngữ lập trình java.
- Hiểu rõ và biết cách phân tích xử lý các vấn đề yêu cầu giải quyết các thuật toán với các bài toán thực tế.
- Áp dụng thành thục thiết kế xây dựng và phát triển web theo mô hình MVC và biết áp dụng framework spring MVC xây dựng sản phẩm
-	Triển khai ứng dụng web động với sự linh hoạt và hiệu suất cao, thực hiện cài đặt, cấu hình trên máy chủ một cách suôn sẻ.
-	Kỹ năng thiết kế và lập trình được cải thiện đáng kể, đồng thời kỹ năng tìm kiếm, đọc hiểu tài liệu và làm việc nhóm được rèn luyện và phát triển. 
2. Hướng phát triển 
- Cùng với sự phát triển của công nghệ, chúng tôi sẽ không ngừng tiếp thu những cái mới, tích lũy thêm kiến thức để có thể phát triển thêm các chức năng khác cho Website như việc thêm các tác vụ AI vào việc xử lý lọc các hồ sơ ứng viên tiềm năng ... 
- Liên tục thu thập thông tin, khảo sát ý kiến người dùng để phát triển thêm các chức năng phù hợp với người dùng. 
- Tạo thêm phần thanh toán gói đăng tin tuyển dụng, để trang web có thể thu phí nhà tuyển dụng mỗi khi đăng tin.
 
TÀI LIỆU THAM KHẢO
[1] Lê Văn Phùng, Kỹ nghệ phần mềm, NXB Thông tin và Truyền thông, 2014.
[2] Đoàn Văn Ban, Nguyễn Thị Tĩnh, Giáo trình phân tích thiết kế hệ thống hướng đối tượng bằng UML, NXB Đại học sư phạm, 2011.
[3] Ian Sommerville, Software Engineering, Ninth Edition, Addison-Wesley, 2011.
[4] Scott Tilley, Harry J. Rosenblatt, Systems Analys and Design, Shelly Cashman Series, 11th Edition, 2016.
[5] Tài liệu về java spring trên trang docs.spring.io: https://docs.spring.io/springframework/reference/web/webmvc.html
[6] Tài liệu về java spring mvc trên trang viblo.asia:  
https://viblo.asia/p/spring-mvc-framework-tutorial-part-1-DbmvmQMVvAg

















