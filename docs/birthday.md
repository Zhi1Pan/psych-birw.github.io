<div class="bday-root">

&#x20; <!-- 星光层（两幕通用） -->

<div class="stars">
    <div class="star-layer s1"></div>
    <div class="star-layer s2"></div>
    <div class="star-layer s3"></div>
  </div>

&#x20; <!-- 物理烟花画布 + 脚本（脚本只在本页加载） -->

<canvas id="fwSky"></canvas>

&#x20; <script src="../assets/javascripts/birthday.js"></script>

<!-- 第三、四幕：点继续后出现（默认隐藏，点“点击继续”后 :target 显示） -->

<section id="photos">

<div class="gallery">
    <figure>
      <img class="d1" src="../assets/photos/photo1.jpg" alt="合照 1">
    </figure>
    <figure>
      <img class="d2" src="../assets/photos/photo2.jpg" alt="合照 2">
    </figure>
    <figure>
      <img class="d3" src="../assets/photos/photo3.jpg" alt="合照 3">
    </figure>
  </div>

<div class="final-note">
    <div class="big-title">🎂 大狗，生日快乐！⚡</div>
    <div class="sub-title">—— 来自 小兔 &amp; 小猫 的魔法惊喜 ——</div>
    <p class="msg">
      欢迎来到 <strong>20 岁</strong>！霍格沃茨特快已驶入第 20 站台，奔三的魔法旅程正式开启（）嘻嘻
      再认认真真地对你说一句：<strong>生日快乐</strong> 🎉<br><br>
      蚊子咬永远是可以让我们放心依靠的存在（人形AI）嘻嘻。
      新的一岁，
      快乐会像有求必应屋里的烟花一样灿烂，烦恼会像被「消失咒」清空一样悄悄不见
      愿你被魔法世界温柔以待，
      也永远被我们坚定地爱着 💙
</p>
<div class="sign">永远的好朋友 ❤️　小兔 🐰 ｜ 小猫 🐱</div>

</div>

<div class="replay"><a href="#">↺ 想再看一遍魔法烟花？点这里重播</a></div>

</section>

<!-- 第一、二幕：默认开场画面（夜空烟花 + 中央卡通舞台） -->

<section id="s0">

&#x20; <!-- 闪电符号 -->

<div class="bolt" aria-hidden="true">
    <svg viewBox="0 0 24 24"><path d="M13 2 L3 14 H10 L9 22 L21 10 H14 Z"/></svg>
  </div>

&#x20; <!-- 中央舞台：蛋糕 → 小狗(顶部) → 小猫(左) → 小兔(右) 依次浮现 -->

&#x20; <!-- 各角色会自动从 /assets/stickers/ 加载表情包；未放图时显示 emoji 兜底 -->

<div class="scene">
    <div class="cake">🎂</div>
    <div class="dog">🐶</div>
    <div class="cat">🐱</div>
    <div class="rabbit">🐰</div>
  </div>

&#x20; <!-- 全部浮现后出现的提示：点击继续 -->

<a class="cont-btn" href="#photos"><span class="ic">✨</span>点击继续<span class="ic">✨</span></a>

</section>

</div>

