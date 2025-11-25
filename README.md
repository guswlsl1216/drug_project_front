# Medi.Check!
 Medi.Check!는 복용 중인 의약품과 영양제를 안전하게 관리할 수 있도록 도와주는 사이트입니다.
 
 AI 사진 인식을 통해 복용 중인 의약품을 검색하고, 의약품끼리 혹은 영양제와의 비교 분석을 통해 상호작용과 위험 요소를 파악할 수 있습니다.
 
 사이트 내 영양제 스토어 이용 시에도 복용약과의 상호작용을 분석하여 안전하게 구매할 수 있습니다.
 
 또한, 복용 중인 의약품과 영양제의 복용 루틴을 설정하여 직접 관리할 수 있습니다.

 ## 개발 기간
 2025년 10월 22일 ~ 2025년 11월 28일 (38일)

 ## 기술 스택
 ### Frontend
 - React
 - Vite
 - React Router
 - Axios

 ### Backend
 - Flask
 - Flask-JWT-Extended
 - Flask-SQLAlchemy
 - MySQL

 ### AI / Machine Learning
 - YOLOv8 (Ultralytics)
 - TensorFlow 2.x
 - PyTorch
 - Huggingface Transformers
 - OpenCV
 
 ## 주요 사용 라이브러리
 ### Frontend
 - Tiptap Editor
 - FullCalendar
 - React-Bootstrap
 - FontAwesome
 - Toss Payments SDK
 - 챗봇??

 ### Backend
 - APScheduler
 - Flask-Mail
 - Pillow
 - Polars


 ## 주요 기능
 ### 의약품 & 영양제 분석
 의약품과 의약품 또는 의약품과 영양제를 비교 분석하여 병용섭취, 중복 성분 등 상호작용 결과를 보여줍니다.

    1. 의약품 추가 : 사진을 찍어 검사하거나 직접 약품명을 입력하여 추가하세요.
  여기에 gif 넣으면 됨

    2. 영양제 추가 : 영양제 제품명을 입력하여 추가하세요.
  
  
    3. 분석 결과 보기 : 결과 보기 버튼을 누르면 의약품-영양제 간 상호작용 결과를 알 수 있습니다.
  
  ### 복용 의약품 / 영양제 루틴
  복용 중인 의약품이나 영양제를 등록하고, 매일 복용했을 때마다 캘린더에 체크할 수 있습니다.

    1. 복용약/영양제 등록 : 