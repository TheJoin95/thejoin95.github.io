<template>
  <section class="about container mx-auto">
    <div class="p-0 md:p-10 mt-10 md:mt-0">
      <div class="p-0 md:p-5 text-center">
        <h1 class="leading-tight text-4xl md:text-5xl font-bold">
          Ciao <span class="wave">&#x1F44B;</span><br />
          I'm Miki Lombardi
          </h1>
      </div>
      <div class="p-5">
        <div class="text-center mx-auto">
          <div id="column-portrait" class="inline-block">
            <div class="rounded-full">
              <img src="/images/miki.jpg" class="rounded-full max-w-full" title="Me" />
            </div>
          </div>
          <div class="w-full md:w-1/3 inline-block">
            <lottie-player
              src="/lotties/social.json"
              background="transparent max-w-full"
              speed="1"
              class="w-full h-64"
              loop
              autoplay />
            <ul class="social-box text-center align-middle leading-none">
              <li class="inline-block pr-1">
                <a href="https://github.com/thejoin95" target="_blank">
                  <svg version="1.1" class="github-icon w-6" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 20 20" enable-background="new 0 0 20 20" xml:space="preserve">
                    <!-- eslint-disable-next-line max-len -->
                    <path fill="#FFFFFF" d="M10.015,9.949c0,0-0.01,0-0.015,0H9.985c-1.191,0-2.24-0.303-2.861,0.268  c-0.371,0.342-0.527,0.754-0.527,1.197c0,1.852,1.483,2.08,3.389,2.08h0.029c1.905,0,3.389-0.229,3.389-2.08  c0-0.443-0.156-0.856-0.527-1.197C12.255,9.646,11.206,9.949,10.015,9.949z M8.393,12.48c-0.363,0-0.656-0.408-0.656-0.91  s0.293-0.908,0.656-0.908S9.05,11.068,9.05,11.57C9.051,12.072,8.757,12.48,8.393,12.48z M11.606,12.48  c-0.363,0-0.657-0.408-0.657-0.91s0.294-0.908,0.657-0.908c0.362,0,0.656,0.406,0.656,0.908  C12.263,12.072,11.969,12.48,11.606,12.48z M10,0.4c-5.302,0-9.6,4.298-9.6,9.6s4.298,9.6,9.6,9.6s9.6-4.298,9.6-9.6  S15.302,0.4,10,0.4z M10.876,13.939c-0.172,0-0.514,0-0.876,0.002c-0.362-0.002-0.704-0.002-0.876-0.002  c-0.76,0-3.772-0.059-3.772-3.689c0-0.834,0.286-1.445,0.755-1.955c-0.074-0.184-0.078-1.232,0.32-2.236c0,0,0.916,0.1,2.301,1.051  C9.017,7.029,9.509,6.988,10,6.988s0.982,0.041,1.273,0.121c1.385-0.951,2.301-1.051,2.301-1.051  c0.398,1.004,0.395,2.053,0.32,2.236c0.469,0.51,0.755,1.121,0.755,1.955C14.648,13.881,11.636,13.939,10.876,13.939z"/>
                  </svg>
                </a>
              </li>
              <li class="inline-block px-1">
                <a href="https://www.facebook.com/mikistorm/" target="_blank">
                  <svg version="1.1" class="fb-icon w-6" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 20 20" enable-background="new 0 0 20 20" xml:space="preserve">
                    <!-- eslint-disable-next-line max-len -->
                    <path fill="#FFFFFF" d="M10,0.4c-5.302,0-9.6,4.298-9.6,9.6s4.298,9.6,9.6,9.6s9.6-4.298,9.6-9.6S15.302,0.4,10,0.4z M12.274,7.034  h-1.443c-0.171,0-0.361,0.225-0.361,0.524V8.6h1.805l-0.273,1.486H10.47v4.461H8.767v-4.461H7.222V8.6h1.545V7.726  c0-1.254,0.87-2.273,2.064-2.273h1.443V7.034z"/>
                  </svg>
                </a>
              </li>
              <li class="inline-block px-1">
                <a href="https://instagram.com/thejoin95" target="_blank">
                  <svg version="1.1" class="ig-icon w-6" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 20 20" enable-background="new 0 0 20 20" xml:space="preserve">
                    <!-- eslint-disable-next-line max-len -->
                    <path fill="#FFFFFF" d="M13.89777,7.05115a1.65591,1.65591,0,0,0-.94891-0.94891,2.76589,2.76589,0,0,0-.92841-0.17218C11.49316,5.906,11.33508,5.90094,10,5.90094S8.50684,5.906,7.97955,5.93005a2.76589,2.76589,0,0,0-.92841.17218,1.65591,1.65591,0,0,0-.94891.94891,2.76589,2.76589,0,0,0-.17218.92841C5.906,8.50684,5.90094,8.665,5.90094,10s0.00507,1.49316.02911,2.02045a2.76553,2.76553,0,0,0,.17218.92841,1.65591,1.65591,0,0,0,.94891.94891,2.76589,2.76589,0,0,0,.92841.17218c0.52716,0.024.6853,0.02911,2.02045,0.02911s1.49329-.00507,2.02045-0.02911a2.76589,2.76589,0,0,0,.92841-0.17218,1.65591,1.65591,0,0,0,.94891-0.94891,2.76553,2.76553,0,0,0,.17218-0.92841c0.024-.52728.02911-0.68536,0.02911-2.02045S14.094,8.50684,14.06995,7.97955A2.76589,2.76589,0,0,0,13.89777,7.05115ZM10,12.56757A2.56757,2.56757,0,1,1,12.56757,10,2.56756,2.56756,0,0,1,10,12.56757ZM12.669,7.931a0.6,0.6,0,1,1,.6-0.6A0.6,0.6,0,0,1,12.669,7.931ZM11.66669,10A1.66669,1.66669,0,1,1,10,8.33331,1.66671,1.66671,0,0,1,11.66669,10ZM10,0.4A9.6,9.6,0,1,0,19.6,10,9.59995,9.59995,0,0,0,10,.4Zm4.96991,11.6615a3.67039,3.67039,0,0,1-.23242,1.21368,2.55612,2.55612,0,0,1-1.46228,1.46228,3.67039,3.67039,0,0,1-1.21368.23242C11.5282,14.99426,11.35791,15,10,15s-1.5282-.00574-2.06152-0.03009a3.67039,3.67039,0,0,1-1.21368-.23242,2.55612,2.55612,0,0,1-1.46228-1.46228,3.67039,3.67039,0,0,1-.23242-1.21368C5.00574,11.5282,5,11.35791,5,10s0.00574-1.5282.03009-2.06152a3.67039,3.67039,0,0,1,.23242-1.21368A2.55612,2.55612,0,0,1,6.72479,5.26251a3.67039,3.67039,0,0,1,1.21368-.23242C8.4718,5.00574,8.64209,5,10,5s1.5282,0.00574,2.06152.03009a3.67039,3.67039,0,0,1,1.21368.23242,2.55612,2.55612,0,0,1,1.46228,1.46228,3.67039,3.67039,0,0,1,.23242,1.21368C14.99426,8.4718,15,8.64209,15,10S14.99426,11.5282,14.96991,12.06152Z"/>
                  </svg>
                </a>
              </li>
              <li class="inline-block px-1">
                <a href="https://www.linkedin.com/in/miki-lombardi/" target="_blank">
                  <svg version="1.1" class="ld-icon w-6" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 20 20" enable-background="new 0 0 20 20" xml:space="preserve">
                    <!-- eslint-disable-next-line max-len -->
                    <path fill="#FFFFFF" d="M10,0.4c-5.302,0-9.6,4.298-9.6,9.6s4.298,9.6,9.6,9.6s9.6-4.298,9.6-9.6S15.302,0.4,10,0.4z M7.65,13.979  H5.706V7.723H7.65V13.979z M6.666,6.955c-0.614,0-1.011-0.435-1.011-0.973c0-0.549,0.409-0.971,1.036-0.971s1.011,0.422,1.023,0.971  C7.714,6.52,7.318,6.955,6.666,6.955z M14.75,13.979h-1.944v-3.467c0-0.807-0.282-1.355-0.985-1.355  c-0.537,0-0.856,0.371-0.997,0.728c-0.052,0.127-0.065,0.307-0.065,0.486v3.607H8.814v-4.26c0-0.781-0.025-1.434-0.051-1.996h1.689  l0.089,0.869h0.039c0.256-0.408,0.883-1.01,1.932-1.01c1.279,0,2.238,0.857,2.238,2.699V13.979z"/>
                  </svg>
                </a>
              </li>
              <li class="inline-block px-1">
                <a href="https://medium.com/@thejoin95" target="_blank">
                  <svg version="1.1" class="md-icon w-6" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 20 20" enable-background="new 0 0 20 20" xml:space="preserve">
                    <!-- eslint-disable-next-line max-len -->
                    <path fill="#FFFFFF" d="M10,0.3999634c-5.3019409,0-9.5999756,4.2980957-9.5999756,9.6000366S4.6980591,19.5999756,10,19.5999756  S19.5999756,15.3019409,19.5999756,10S15.3019409,0.3999634,10,0.3999634z M14.2000122,7.666687h-0.1165771  c0,0-0.3500977,0-0.3500977,0.3500977c0,0.3500366,0,3.9666748,0,3.9666748s0,0.3497925,0.3500977,0.3497925h0.1165771v0.9333496  h-2.7999878V12.333252h0.4666138V7.9933472h-0.0466309l-1.4301147,5.2732544H9.1304321L7.7133179,7.9933472H7.666687v4.3399048  h0.4666748v0.9333496h-2.333374V12.333252h0.1165771c0,0,0.3500977,0,0.3500977-0.3500366s0-3.9667358,0-3.9667358  s0-0.3497925-0.3500977-0.3497925H5.7999878V6.7333984H8.895874l1.0858765,4.0408325h0.0357666l1.0959473-4.0408325h3.0865479  V7.666687z"/>
                  </svg>
                </a>
              </li>
              <li class="inline-block px-1">
                <a href="https://twitter.com/thejoin95" target="_blank">
                  <svg version="1.1" class="tw-icon w-6" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 20 20" enable-background="new 0 0 20 20" xml:space="preserve">
                    <!-- eslint-disable-next-line max-len -->
                    <path fill="#FFFFFF" d="M10,0.4c-5.302,0-9.6,4.298-9.6,9.6s4.298,9.6,9.6,9.6s9.6-4.298,9.6-9.6S15.302,0.4,10,0.4z M13.905,8.264  c0.004,0.082,0.005,0.164,0.005,0.244c0,2.5-1.901,5.381-5.379,5.381c-1.068,0-2.062-0.312-2.898-0.85  c0.147,0.018,0.298,0.025,0.451,0.025c0.886,0,1.701-0.301,2.348-0.809c-0.827-0.016-1.525-0.562-1.766-1.312  c0.115,0.021,0.233,0.033,0.355,0.033c0.172,0,0.34-0.023,0.498-0.066c-0.865-0.174-1.517-0.938-1.517-1.854V9.033  C6.257,9.174,6.549,9.26,6.859,9.27C6.351,8.93,6.018,8.352,6.018,7.695c0-0.346,0.093-0.672,0.256-0.951  c0.933,1.144,2.325,1.896,3.897,1.977c-0.033-0.139-0.049-0.283-0.049-0.432c0-1.043,0.846-1.891,1.891-1.891  c0.543,0,1.035,0.23,1.38,0.598c0.431-0.086,0.835-0.242,1.2-0.459c-0.141,0.441-0.44,0.812-0.831,1.047  c0.383-0.047,0.747-0.148,1.086-0.299C14.595,7.664,14.274,7.998,13.905,8.264z"/>
                  </svg>
                </a>
              </li>
              <li class="inline-block px-1">
                <a href="https://www.youtube.com/channel/UC1QLLgrGrPmlaFhS0orykCA" target="_blank">
                  <svg version="1.1" class="yt-icon w-6" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 20 20" enable-background="new 0 0 20 20" xml:space="preserve">
                    <!-- eslint-disable-next-line max-len -->
                    <path fill="#FFFFFF" d="M11.603,9.833L9.357,8.785C9.161,8.694,9,8.796,9,9.013v1.974c0,0.217,0.161,0.319,0.357,0.228l2.245-1.048  C11.799,10.075,11.799,9.925,11.603,9.833z M10,0.4c-5.302,0-9.6,4.298-9.6,9.6s4.298,9.6,9.6,9.6s9.6-4.298,9.6-9.6  S15.302,0.4,10,0.4z M10,13.9c-4.914,0-5-0.443-5-3.9s0.086-3.9,5-3.9s5,0.443,5,3.9S14.914,13.9,10,13.9z"/>
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="p-5">
        <div class="flex mt-2 flex-wrap">
          <div class="mx-auto w-full prose md:prose-xl biography text-justify">
            <h2 class="text-3xl font-bold">What I do?</h2>
            <p>
              I helped Aperion and Plansoft to delivery high quality products, software and
              services to their customers.
              My core knowledge has been instrumental in resolving complex architectural
              and software development challenges.<br/><br/>
              Working within the scopes of a lot of technical roles such as software engineer,
                course trainer, tech lead,
              solutions architect and head of R&D, I have developed a precise understanding of
                various technicalities which
              has helped me in maximizing value of my company and products
              in my current leadership roles.</p>
            <br/>
            <p>
              My colleagues know me as an excellent communicator.
              I like to use an interactive approach for understanding and solving problems
              of varied scopes.<br/><br/>
              I’m also enjoying sharing the knowledge with the community by writing
              articles and build / contribute to open source project.
            </p>
            <p>
              Always striving to improve, I love learning new things and face challenging problems.
              I love to follow a mentor and I like to be mentor for others too.
            </p><br/>
            <p>In my experience I have always found a friendly and homely
              environment, even in large companies.
              I like to always give a touch of style to work, especially with
              the people who are part of it.
            </p>
              <p>I'm always looking for the next challenge and I would like to
              be part of the solution process.
            </p>
            <div class="mt-10 text-center">
              <a download href="/miki-lombardi-resume.pdf"
              class="w-1/3 bg-gray-600 hover:bg-gray-500 text-white
              font-bold py-2 px-4 border-b-4 border-gray-700 hover:border-gray-500
              rounded inline-flex items-center">
                <svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg>
                <span>Download Miki's Resume</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  metaInfo: {
    title: 'Who am I',
    meta: [{
      vmid: 'description',
      name: 'description',
      content: 'A short description about me',
    }],
  },
};
</script>
<style lang="scss" scoped>
#column-portrait {
  img {
    border: 8px solid $dark-4;
  }
}

</style>
