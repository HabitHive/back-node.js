![image](https://user-images.githubusercontent.com/106153814/193546577-80451e33-d4f6-422e-8da9-86f205ba55e6.png)

## 💜 [해빗래빗 바로가기][habit-rabbit] 💜
[habit-rabbit]: https://habit-rabbit.shop/ '해빗래빗'

#### 귀여운 펫과 함께 습관을 고쳐가며 성장해보세요!

---

## Project Info

### 🏗 Architecture

![image](https://user-images.githubusercontent.com/106153814/193535566-5abdb0bb-8603-4a86-b14d-396205b075e1.png)

### 🛠 Tools
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/express-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
<br>
![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=black)
![AWS EC2](https://img.shields.io/badge/AWS%20EC2-%23FF9900.svg?style=for-the-badge&logo=amazon-ec2&logoColor=black)
![AWS RDS](https://img.shields.io/badge/AWS%20RDS-%23527FFF.svg?style=for-the-badge&logo=amazon-rds&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7.svg?style=for-the-badge&logo=Sequelize&logoColor=white)
<br>
![Passport](https://img.shields.io/badge/Passport-34E27A?style=for-the-badge&logo=Passport&logoColor=black)
<img src="https://img.shields.io/badge/JSON Web Tokens-000000?style=for-the-badge&logo=JSON Web Tokens&logoColor=white">
<br>
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=Jest&logoColor=white)
![PM2](https://img.shields.io/badge/PM2-2B037A?style=for-the-badge&logo=pm2&logoColor=white)

<details>
<summary><b>Library</b></summary>

Library | description
---|:---:
<img src='https://img.shields.io/badge/bcrypt-5.0.1-lightgrey'>| 비밀번호 암호화
<img src='https://img.shields.io/badge/chalk-4.1.2-lightgrey'>| 콘솔 컬러 추가
<img src='https://img.shields.io/badge/cookie--parser-1.4.6-lightgrey'> | 요청에 담긴 쿠키 추출
<img src='https://img.shields.io/badge/cors-2.8.5-lightgrey'> | 교차 리소스 공유
<img src='https://img.shields.io/badge/dotenv-16.0.1-lightgrey'> | 환경변수 관리
<img src='https://img.shields.io/badge/express-4.18.1-lightgrey'> | 프레임워크
<img src='https://img.shields.io/badge/express--session-1.17.3-lightgrey'> | 세션 생성 및 삭제
<img src='https://img.shields.io/badge/joi-17.6.0-lightgrey'> | 입력데이터 검출
<img src='https://img.shields.io/badge/jsonwebtoken-9.5.1-lightgrey'> | 토큰 관리
<img src='https://img.shields.io/badge/morgan-1.10.0-lightgrey'> | 요청 정보 콘솔 감시
<img src='https://img.shields.io/badge/mysql2-2.3.3-lightgrey'> | MySQL
<img src='https://img.shields.io/badge/nodemailer-6.7.8-lightgrey'> | 메일 전송
<img src='https://img.shields.io/badge/nodemon-2.0.19-lightgrey'> | 스크립트 모니터링 유틸리티
<img src='https://img.shields.io/badge/passport-0.6.0-lightgrey'> | 로그인 모듈
<img src='https://img.shields.io/badge/passport--google--oauth2-0.2.0-lightgrey'> | 구글 로그인
<img src='https://img.shields.io/badge/passport--kakao-1.0.1-lightgrey'> | 카카오 로그인
<img src='https://img.shields.io/badge/passport--naver-1.0.6-lightgrey'> | 네이버 로그인
<img src='https://img.shields.io/badge/prettier-2.7.1-lightgrey'> | 코드 스타일 통일
<img src='https://img.shields.io/badge/sequelize-6.21.4-lightgrey'> | MySQL ORM
<img src='https://img.shields.io/badge/sequelize--cli-6.4.1-lightgrey'> | MySQL ORM Console

</details>

---

## 💥트러블 슈팅

<details>
<summary><b>1️⃣ EC2 Instance 접근 불가 (Connection timed out)  </b></summary>  

> **이유** : HTTPS를 위해 ec2에서 Nginx 설정 중 ufw enable 사용 여부를 물었는데 Command may disrupt existing ssh connections 라는 경고 문구에도 허용해 이후 ssh 연결이 불가했다.  
> **해결** : aws에서 새 instance 생성 → 기존 instance 중지 후 볼륨 분리 → 해당 볼륨을새 instance로 연결 → 새 instance의 ufw 폴더에서 연결된 볼륨 파일을 수정 (위의 1안과 동일) → 새 instance 중지 후 임시 연결했던 볼륨 분리 후 기존 instance로 연결 → 기존 instance 시작하면 해결  
</details>

<details>
<summary><b>2️⃣ Date타입 데이터 로직 오류</b></summary>  

> **이유** : Front/EC2/DB UTC 차이 (Front:+09:00/EC2:+00:00/DB:+09:00) 로 인해 제대로 작동하지 않았다.
> **해결** : UTC로 인한 데이터 변화가 없도록 코드 재구성 및 MySQL Timezone 명시
</details>

## 👥 Back-End 팀원
|성명|GitHub|E-mail|
|----|-----|-----|
| **용성령**🔰|https://github.com/ryeong25|tjdfud1789@naver.com|
| **최진광** |https://github.com/jinguang-chou|chjg1231@gmail.com|
| **김영광** |https://github.com/maneuljokbal||

### 💜 Front-End Repo [보러가기][front] 💜
[front]: https://github.com/HabitHive/front-react '해빗래빗 프론트'
