import GlyphComponent from "../../GlyphComponent.js";

export default {
  name: "GlyphInventory",
  components: {
    GlyphComponent
  },
  data() {
    return {
      inventory: [],
      newGlyphs: [],
      unequippedGlyphs: [],
      doubleClickTimeOut: null,
      clickedGlyphId: null,
      glyphSacrificeUnlocked: false,
      protectedRows: 0,
      page: 0
    };
  },
  computed: {
    rowCount: () => Math.floor(Glyphs.totalSlots / 30),
    colCount: () => 6,
    //5 pages in total (0 is the first).
    pageCount: () => 4
  },
  created() {
    this.on$(GAME_EVENT.GLYPHS_CHANGED, this.glyphsChanged);
    this.on$(GAME_EVENT.GLYPH_VISUAL_CHANGE, this.glyphsChanged);
    this.glyphsChanged();
  },
  watch: {
    page(newValue) {
      player.reality.glyphs.page = newValue;
    }
  },
  methods: {
    update() {
      this.glyphSacrificeUnlocked = GlyphSacrificeHandler.canSacrifice;
      this.protectedRows = player.reality.glyphs.protectedRows;
      this.newGlyphs = Glyphs.unseen;
      this.unequippedGlyphs = Glyphs.unequipped;
      this.page = player.reality.glyphs.page;
    },
    toIndex(row, col) {
      return (this.page * this.colCount + row - 1) * this.colCount + (col - 1);
    },
    allowDrag(event) {
      if (event.dataTransfer.types.includes(GLYPH_MIME_TYPE)) event.preventDefault();
    },
    drop(idx, event) {
      const id = parseInt(event.dataTransfer.getData(GLYPH_MIME_TYPE), 10);
      if (isNaN(id)) return;
      const glyph = Glyphs.findById(id);
      if (!glyph) return;
      Glyphs.moveToSlot(glyph, idx);
    },
    removeGlyph(id, force) {
      GlyphSacrificeHandler.removeGlyph(Glyphs.findById(id), force);
    },
    clickGlyph(col, id) {
      const glyph = Glyphs.findById(id);
      // If single click
      if (!this.doubleClickTimeOut) {
        this.doubleClickTimeOut = setTimeout(() => {
          this.clickedGlyphId = null;
          this.doubleClickTimeOut = null;
        }, 200);
        this.clickedGlyphId = id;
        if (!glyph) return;
        if (Glyphs.isMusicGlyph(glyph)) {
          new Audio(`audio/note${col}.mp3`)
            .play();
        }
        // Else it's double click, so equip a glyph
      } else if (this.clickedGlyphId === id) {
        clearTimeout(this.doubleClickTimeOut);
        this.doubleClickTimeOut = null;
        const idx = Glyphs.active.indexOf(null);
        if (idx !== -1) Glyphs.equip(glyph, idx);
      }
    },
    glyphsChanged() {
      this.inventory = Glyphs.inventory.map(GlyphGenerator.copy);
    },
    slotClass(index) {
      return index < Glyphs.protectedSlots ? "c-glyph-inventory__protected-slot" : "c-glyph-inventory__slot";
    },
    isNew(index) {
      return player.options.showNewGlyphIcon && this.newGlyphs.includes(this.inventory[index].id);
    },
    isUnequipped(index) {
      return player.options.showUnequippedGlyphIcon && this.unequippedGlyphs.includes(this.inventory[index].id);
    },
    addPage() {
      if (this.page >= this.pageCount) return;
      this.page++;
    },
    deletePage() {
      if (this.page <= 0) return;
      this.page--;
    }
  },
  template: `<div class="l-glyph-inventory">
    Click and drag or double-click to equip Glyphs.
    <div>
      <button
        @click="deletePage()"
        class="c-reality-upgrade-btn c-glyph-page-btn"
        :enabled="page > 0"
      >
        <i class="fas fa-minus" />
      </button>
      <span class="c-glyph-page-text">Page {{ page + 1 }}</span>
      <button
        @click="addPage()"
        class="c-reality-upgrade-btn c-glyph-page-btn"
        :enabled="page < pageCount"
      >
        <i class="fas fa-plus" />
      </button>
    </div>
    <div
      v-for="row in rowCount"
      :key="protectedRows + row"
      class="l-glyph-inventory__row"
    >
      <div
        v-for="col in colCount"
        :key="col"
        class="l-glyph-inventory__slot"
        :class="slotClass(toIndex(row, col))"
        @dragover="allowDrag"
        @drop="drop(toIndex(row, col), $event)"
      >
        <GlyphComponent
          v-if="inventory[toIndex(row, col)]"
          :glyph="inventory[toIndex(row, col)]"
          :is-new="isNew(toIndex(row, col))"
          :is-unequipped="isUnequipped(toIndex(row, col))"
          :is-inventory-glyph="true"
          :show-sacrifice="glyphSacrificeUnlocked"
          :draggable="true"
          @shiftClicked="removeGlyph($event, false)"
          @ctrlShiftClicked="removeGlyph($event, true)"
          @clicked="clickGlyph(col, $event)"
        />
      </div>
    </div>
  </div>`
}