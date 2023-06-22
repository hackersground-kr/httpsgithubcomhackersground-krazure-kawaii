# `우리집애저는귀여웡` - `포용런`

해커그라운드 해커톤에 참여하는 `우리집애저는귀여웡` 팀의 `포용런`입니다.

### 참고 문서

> 아래 두 링크는 해커톤에서 앱을 개발하면서 참고할 만한 문서들입니다. 이 문서들에서 언급한 서비스 이외에도 더 많은 서비스들이 PaaS, SaaS, 서버리스 형태로 제공되니 참고하세요.

- [순한맛](./REFERENCES_BASIC.md)
- [매운맛](./REFERENCES_ADVANCED.md)

## 제품/서비스 소개

<!-- 아래 링크는 지우지 마세요 -->
[제품/서비스 소개 보기](TOPIC.md)
<!-- 위 링크는 지우지 마세요 -->

## 오픈 소스 라이센스

<!-- 아래 링크는 지우지 마세요 -->
[오픈소스 라이센스 보기](./LICENSE)
<!-- 위 링크는 지우지 마세요 -->

## 설치 방법

> **사전 준비 사항**
* [Azure-CLI](https://aka.ms/installazurecliwindows)
  
* [Azure-Account](https://azure.microsoft.com/ko-kr/)

* [Github-Account](https://github.com/)

* [Git, Github-CLI](https://git-scm.com/downloads)

* [powershell (ps1), pwsh]
## 시작하기

> **배포하기**
1. 레포지토리를 포크해서 가져옵니다.

1-1. 포크된 리포지토리로 이동해 상단 Actions 탭을 클릭합니다.
<img src="/images/cap8.png">

1-2. "I understand my workflows, go ahead and enable them"을 클릭하여 Action을 enable 시켜줍니다.

2. Back-end 세팅을 위해 준비된 Powershell Script를 다운로드합니다.

[PS Script 다운로드](./auto.ps1)

(오직 auto.ps1만 다운하시면 됩니다.)

<br>
3. 다운받은 'auto.ps1'파일 내부의 GITHUB_USERNAME과 GITHUB_REPOSITORY를 본인의 아이디와 포크한 Repo로 알맞게 수정합니다.
<img src="/images/cap.png">
편집을 들어갑니다.

<img src="/images/cap2.PNG">
위 코드를 수정해야합니다.

<img src="/images/cap3.PNG">
깃허브 아이디와 레포 이름을 수정합니다.

WIN + R 로 실행창을 켜 "Powershell" 입력해 실행시킵니다.
Powershell에서 az login을 입력합니다.
그리고 사용할 마이크로소프트 계정을 선택하신 후 저장 합니다.

<img width="1552" alt="스크린샷 2023-06-23 오전 1 03 14" src="https://github.com/hackersground-kr/httpsgithubcomhackersground-krazure-kawaii/assets/84012697/c32784cb-461b-4560-9f08-4c7bf423807e">

화면이 뜬다면

그리고 저장한 auto.ps1을 실행합니다.
<br>

실행시 자동적으로 세팅이 완료됩니다.

이후 az login에서 선택한 계정으로 [Azure](https://portal.azure.com/#home) 접속하여 확인합니다.

리소스 그룹 선택
<img src="/images/cap5.png">
<br>

backend 선택
<img src="/images/cap6.png">
<br>

기본 도메인란에 URL 클릭
<img src="/images/cap9.png">
<br>

최종적으로 배포된 URL로 접속해 확인해볼 수 있습니다.
<img src="/images/cap11.png">
