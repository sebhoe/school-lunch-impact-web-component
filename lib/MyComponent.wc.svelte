<svelte:options tag="my-component" />

<script>
  /**
   * function for button to download banner as an image
   *
   * 2 libraries are used:
   * dom-to-image: https://github.com/tsayen/dom-to-image
   * FileSaver.js: https://github.com/eligrey/FileSaver.js
   */
  import * as domtoimage from "dom-to-image";
  import { saveAs } from "file-saver";

  let canvas;

  function downloadBanner() {
    domtoimage.toBlob(canvas).then(function (blob) {
      window.saveAs(blob, "banner.png");
    });
  }

  /**
   * Constants
   */
  const ADULT_NUTRITION = 2000,
    CHILD_NUTRITION = 1800,
    ADULT_TO_CHILD_FAKTOR = CHILD_NUTRITION / ADULT_NUTRITION,
    KCAL_MEAT_TO_PLANT = 0.000684,
    KCAL_MEAT_TO_VEG = 0.00046,
    KCAL_VEG_TO_PLANT = 0.000224,
    CARBON_PER_KM = 120 / 1000000,
    WATER_PER_MEAL = (3000 - 1700) * 0.25,
    LITER_PER_BATHTUB = 150,
    LAND_PER_MEAL_MEAT_TO_VEG = (790 / 365) * 0.25,
    LAND_PER_MEAL_MEAT_TO_PLANT = (970 / 365) * 0.25,
    LAND_PER_MEAL_VEG_TO_PLANT = ((970 - 790) / 365) * 0.25,
    SQUARE_METER_PER_PITCH = 7140;

  let menuLines = 2,
    minMenuLines = 1,
    maxMenuLines = 5,
    meatToPlant = 1,
    meatToVeg = 1,
    vegToPlant = 1,
    dishesPerDay = 200,
    maxDishesPerDay = 10000,
    daysPerWeek = 5,
    daysPerYear = 200;

  $: carbonMeatToVeg =
    ((meatToVeg * dishesPerDay) / menuLines) *
    daysPerYear *
    KCAL_MEAT_TO_VEG *
    ADULT_TO_CHILD_FAKTOR;
  $: carbonMeatToPlant =
    ((meatToPlant * dishesPerDay) / menuLines) *
    daysPerYear *
    KCAL_MEAT_TO_PLANT *
    ADULT_TO_CHILD_FAKTOR;
  $: carbonVegToPlant =
    ((vegToPlant * dishesPerDay) / menuLines) *
    daysPerYear *
    KCAL_VEG_TO_PLANT *
    ADULT_TO_CHILD_FAKTOR;
  $: sumCarbon = carbonMeatToVeg + carbonMeatToPlant + carbonVegToPlant;

  $: waterMeatToVeg =
    ((meatToVeg * dishesPerDay) / menuLines) * daysPerYear * WATER_PER_MEAL;
  $: waterMeatToPlant =
    ((meatToPlant * dishesPerDay) / menuLines) * daysPerYear * WATER_PER_MEAL;
  // $: waterVegToPlant =
  // 	((vegToPlant * dishesPerDay) / menuLines) *
  // 	daysPerYear * WATER_PER_MEAL;
  $: sumWater = waterMeatToVeg + waterMeatToPlant;

  $: landMeatToVeg =
    ((meatToVeg * dishesPerDay) / menuLines) *
    daysPerYear *
    LAND_PER_MEAL_MEAT_TO_VEG *
    ADULT_TO_CHILD_FAKTOR;
  $: landMeatToPlant =
    ((meatToPlant * dishesPerDay) / menuLines) *
    daysPerYear *
    LAND_PER_MEAL_MEAT_TO_PLANT *
    ADULT_TO_CHILD_FAKTOR;
  $: landVegToPlant =
    ((vegToPlant * dishesPerDay) / menuLines) *
    daysPerYear *
    LAND_PER_MEAL_VEG_TO_PLANT *
    ADULT_TO_CHILD_FAKTOR;
  $: sumLand = landMeatToVeg + landMeatToPlant + landVegToPlant;
</script>

<main>
  <h1>Schulverpflegung Impact Rechner</h1>

  <ol>
    <li>
      <h2>
        Wie viele <strong>Menülinien</strong> bieten Sie an?
      </h2>
      <p class="flex-wrapper">
        <input
          type="range"
          bind:value={menuLines}
          min={minMenuLines}
          max={maxMenuLines}
        />
        <input
          type="number"
          bind:value={menuLines}
          min={minMenuLines}
          max={maxMenuLines}
        />
      </p>
    </li>

    <li>
      <h2>
        Wie viele <strong>Gerichte</strong> in Ihren Menülinien möchten Sie klima-
        und umweltfreundlicher gestalten (pro Woche)?
      </h2>
      <div class="flex-wrapper flex-wrapper--space-around">
        <div class="flex-wrapper flex-wrapper--col">
          <p class="large-icons">
            <img src="./img/icons/meat.png" alt="meat icon" />
            <img src="./img/icons/arrow.png" alt="arrow icon" />
            <img src="./img/icons/plant.png" alt="plantbased icon" />
          </p>
          <label class="inline">
            <input
              name="KCAL_meat_to_plant"
              type="number"
              bind:value={meatToPlant}
              min="0"
              max="100"
            />
            Gerichte
          </label>
          <small>vegetarisch statt fleischhaltig</small>
        </div>

        <div class="flex-wrapper flex-wrapper--col">
          <p class="large-icons">
            <img src="./img/icons/meat.png" alt="meat icon" />
            <img src="./img/icons/arrow.png" alt="arrow icon" />
            <img src="./img/icons/veg.png" alt="vegan icon" />
          </p>
          <label class="inline">
            <input
              name="KCAL_meat_to_veg"
              type="number"
              bind:value={meatToVeg}
              min="0"
              max="100"
            />
            Gerichte
          </label>
          <small>rein pflanzlich statt fleischhaltig</small>
        </div>

        <div class="flex-wrapper flex-wrapper--col">
          <p class="large-icons">
            <img src="./img/icons/plant.png" alt="plantbased icon" />
            <img src="./img/icons/arrow.png" alt="arrow icon" />
            <img src="./img/icons/veg.png" alt="vegan icon" />
          </p>
          <label class="inline">
            <input
              name="KCAL_veg_to_plant"
              type="number"
              bind:value={vegToPlant}
              min="0"
              max="100"
            />
            Gerichte
          </label>
          <small>rein pflanzlich statt vegetarisch</small>
        </div>
      </div>
    </li>

    <li>
      <h2>
        Wie viele <strong>Portionen</strong> bereiten Sie bei regulärem
        Schulbetrieb <strong>pro Tag</strong> zu?
      </h2>
      <p class="flex-wrapper">
        <label class="inline">
          <input
            type="number"
            bind:value={dishesPerDay}
            min="0"
            max={maxDishesPerDay}
          />
          Portionen
        </label>
      </p>
    </li>
  </ol>

  <section>
    <h2>
      Durch den Einsatz von
      <strong>
        {(meatToPlant + meatToVeg + vegToPlant) * dishesPerDay * daysPerWeek}
        klima- und umweltfreundlicheren Mahlzeiten
      </strong>
      pro Woche sparen sie im Jahr etwa
    </h2>
  </section>

  <section bind:this={canvas}>
    <div class="banner">
      <div class="text-box text-box--first">
        <span class="text text--big text--bold text--uppercase"
          >Wir sparen pro Jahr</span
        >
        <br />
        <span class="text text--small">
          durch die Reduktion von tierischen Lebensmitteln in der
          Schulverpflegung bis zu...
        </span>
      </div>
      <div class="logo">
        <img src="./img/proveg-logo.svg" alt="proveg logo" />
      </div>
      <div class="dotted-border" />
    </div>
    <div class="banner">
      <div class="icon icon--right">
        <img src="./img/icons/carbon.png" alt="carbon icon" />
      </div>
      <div class="text-box">
        <span class="text text--bold text--orange">
          {sumCarbon.toLocaleString(undefined, {
            maximumFractionDigits: 1,
          })}
          Tonnen
        </span>
        <span class="text">
          CO<sub>2</sub>-Equivalente,
        </span>
        <br />
        <span class="text"> das entspricht </span>
        <span class="text text--bold text--orange">
          {(sumCarbon / CARBON_PER_KM).toLocaleString()}
          km
        </span>
        <span class="text"> mit dem Auto</span>
      </div>
      <div class="dotted-border" />
    </div>
    <div class="banner">
      <div class="icon">
        <img src="./img/icons/waterdrop.png" alt="waterdrop icon" />
      </div>
      <div class="text-box">
        <span class="text text--bold text--blue">
          {sumWater.toLocaleString()}
          Liter
        </span>
        <span class="text"> Wasser,</span>
        <br />
        <span class="text"> das entspricht </span>
        <span class="text text--bold text--blue">
          {(sumWater / LITER_PER_BATHTUB).toLocaleString(undefined, {
            maximumFractionDigits: 0,
          })}
        </span>
        <span class="text text--bold text--blue">Badewannen</span>
      </div>
      <div class="dotted-border" />
    </div>
    <div class="banner">
      <div class="icon icon--right">
        <img src="./img/icons/forrest.png" alt="forrest icon" />
      </div>
      <div class="text-box">
        <span class="text text--bold text--green">
          {sumLand.toLocaleString(undefined, {
            maximumFractionDigits: 0,
          })}
          m<sup>2</sup>
        </span>
        <span class="text"> Land,</span>
        <br />
        <span class="text"> das entspricht </span>
        <span class="text text--bold text--green">
          {(sumLand / SQUARE_METER_PER_PITCH).toLocaleString(undefined, {
            maximumFractionDigits: 1,
          })}
        </span>
        <span class="text text--bold text--green">Fußballfeldern</span>
      </div>
      <div class="dotted-border" />
    </div>
    <div class="banner">
      <div class="link">
        Berechnet auf <span class="text--uppercase"
          >proveg.com/impact-rechner</span
        >
      </div>
    </div>
  </section>

  <button class="download-banner" on:click={downloadBanner}
    >Banner speichern</button
  >
</main>

<style lang="scss">
  main {
    text-align: center;
    min-width: 258px;
    margin: 0 auto;
    color: #11284a;
  }

  h1 {
    font-weight: 500;
  }

  h2 {
    font-size: 1.2em;
    font-weight: 400;
  }

  ol {
    list-style: inside decimal;
    padding-left: 0;

    li {
      margin-bottom: 3rem;

      &::marker {
        display: inline;
      }

      h2 {
        display: inline;
      }
    }
  }

  .flex-wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;

    &--col {
      flex-direction: column;
    }

    &--space-around {
      justify-content: space-around;
    }
  }

  .large-icons img {
    margin-top: 5px;
    max-height: 40px;
  }

  .text-box {
    flex-grow: 1;
    align-self: center;

    &--first {
      margin-top: 8px;
    }
  }

  .text {
    font-size: 1.4em;

    &--big {
      font-size: 1.5em;
    }

    &--small {
      font-size: 1.1em;
    }

    &--bold {
      font-weight: 400;
    }

    &--uppercase {
      text-transform: uppercase;
    }

    &--orange {
      color: #ffae2c;
    }

    &--blue {
      color: #5bb7e5;
    }

    &--green {
      color: #73c800;
    }
  }

  .banner {
    position: relative;
    display: flex;
    text-align: left;
    font-size: 0.85em;
    font-weight: 300;
    line-height: 1.2;
    color: white;
    background-color: #11284a;
    padding: 8px 18px;
    margin: auto;
    max-width: 500px;

    .icon {
      align-self: center;
      flex: 0 0 70px;
      margin-right: 16px;

      &--right {
        order: 1;
        margin-right: 0;
      }
    }

    .logo {
      position: absolute;
      top: 12px;
      right: 20px;
      width: 70px;
    }

    img {
      width: 100%;
    }

    .link {
      text-align: right;
      width: 100%;
      font-size: 0.75em;
    }

    @media (min-width: 640px) {
      font-size: initial;

      .icon {
        flex-basis: 100px;
      }

      .logo {
        width: 90px;
      }
    }
  }

  .dotted-border {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 1px;
    background-image: linear-gradient(
      to right,
      #606060 0%,
      #606060 40%,
      transparent 40%
    );
    background-size: 5px 1px;
  }

  .inline {
    display: inline;
  }

  input {
    font-family: inherit;
    font-size: inherit;
    -webkit-padding: 0.4em 0;
    padding: 0.4em;
    margin: 0 0 0.5em 0;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 2px;
  }

  input:disabled {
    color: #ccc;
  }

  input[type="range"] {
    -webkit-appearance: none;
    border: none;
    /* width: 100%; */
  }
  input[type="range"]:focus {
    outline: none;
  }
  input[type="range"]::-webkit-slider-runnable-track {
    /* width: 100%; */
    height: 8.4px;
    cursor: pointer;
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
    background: #3071a9;
    border-radius: 1.3px;
    border: 0.2px solid #010101;
  }
  input[type="range"]::-webkit-slider-thumb {
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
    border: 1px solid #000000;
    height: 36px;
    width: 16px;
    border-radius: 3px;
    background: #ffffff;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -14px;
  }
  input[type="range"]:focus::-webkit-slider-runnable-track {
    background: #367ebd;
  }
  input[type="range"]::-moz-range-track {
    /* width: 100%; */
    height: 8.4px;
    cursor: pointer;
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
    background: #3071a9;
    border-radius: 1.3px;
    border: 0.2px solid #010101;
  }
  input[type="range"]::-moz-range-thumb {
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
    border: 1px solid #000000;
    height: 36px;
    width: 16px;
    border-radius: 3px;
    background: #ffffff;
    cursor: pointer;
  }
  input[type="range"]::-ms-track {
    /* width: 100%; */
    height: 8.4px;
    cursor: pointer;
    background: transparent;
    border-color: transparent;
    border-width: 16px 0;
    color: transparent;
  }
  input[type="range"]::-ms-fill-lower {
    background: #2a6495;
    border: 0.2px solid #010101;
    border-radius: 2.6px;
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
  }
  input[type="range"]::-ms-fill-upper {
    background: #3071a9;
    border: 0.2px solid #010101;
    border-radius: 2.6px;
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
  }
  input[type="range"]::-ms-thumb {
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
    border: 1px solid #000000;
    height: 36px;
    width: 16px;
    border-radius: 3px;
    background: #ffffff;
    cursor: pointer;
  }
  input[type="range"]:focus::-ms-fill-lower {
    background: #3071a9;
  }
  input[type="range"]:focus::-ms-fill-upper {
    background: #367ebd;
  }

  .download-banner {
    margin: 4rem 0;
  }

  @media (min-width: 640px) {
    main {
      max-width: 600px;
    }
  }
</style>
