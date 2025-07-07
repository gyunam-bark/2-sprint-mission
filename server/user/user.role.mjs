const USER_ROLES = {
  PUBLIC: 'public',   // 비로그인 가능
  USER: 'user',       // 로그인만 필요
  OWNER: 'owner',     // 본인이거나 MASTER
  MASTER: 'master',   // 오직 MASTER
};

export default USER_ROLES;