<template>
  <div>
    <!-- FOR MOBILE SIDEBAR -->
    <TransitionRoot as="template" :show="sidebarOpen">
      <Dialog
        as="div"
        class="relative z-50 lg:hidden"
        @close="sidebarOpen = false"
      >
        <!-- BACKDROP -->
        <TransitionChild
          as="template"
          enter="transition-opacity ease-linear duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-900/80 backdrop-blur-sm" />
        </TransitionChild>

        <div class="fixed inset-0 flex">
          <!-- SIDEBAR PANEL -->
          <TransitionChild
            as="template"
            enter="transition ease-in-out duration-300 transform"
            enter-from="-translate-x-full"
            enter-to="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leave-from="translate-x-0"
            leave-to="-translate-x-full"
          >
            <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
              <!-- CLOSE BUTTON -->
              <TransitionChild
                as="template"
                enter="ease-in-out duration-300"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="ease-in-out duration-300"
                leave-from="opacity-100"
                leave-to="opacity-0"
              >
                <div
                  class="absolute left-full top-0 flex w-16 justify-center pt-5"
                >
                  <button
                    type="button"
                    class="-m-2.5 p-2.5 rounded-md hover:bg-white/10 transition-colors"
                    @click="sidebarOpen = false"
                  >
                    <span class="sr-only">Close sidebar</span>
                    <XMarkIcon class="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </TransitionChild>

              <!-- SIDEBAR CONTENT -->
              <div
                class="flex grow flex-col overflow-y-auto bg-[var(--system-color)] px-3 pb-4 shadow-xl"
              >
                <!-- LOGO — match desktop expanded state -->
                <div
                  class="h-16 shrink-0 relative flex items-center justify-center border-b border-black/20 bg-[var(--system-color)] overflow-hidden"
                >
                  <img
                    v-if="imageSrc"
                    :src="imageSrc"
                    class="absolute h-16 w-auto object-contain scale-105"
                  />
                </div>

                <!-- NAVIGATION -->
                <nav class="w-full py-3 flex flex-col gap-2">
                  <!-- SKELETON LOADER -->
                  <template v-if="!hasLoaded">
                    <div
                      v-for="i in 15"
                      :key="'mskel-' + i"
                      class="w-full flex flex-col gap-0.5"
                    >
                      <div
                        class="w-full flex items-center justify-between px-3 py-3 bg-white/15 rounded-lg animate-pulse"
                      >
                        <div class="flex items-center gap-2.5 min-w-0">
                          <div
                            class="shrink-0 h-4 w-4 rounded bg-white/40"
                          ></div>
                          <div
                            class="h-2.5 rounded bg-white/30"
                            :class="
                              i % 5 === 0
                                ? 'w-20'
                                : i % 4 === 0
                                  ? 'w-24'
                                  : i % 3 === 0
                                    ? 'w-32'
                                    : i % 2 === 0
                                      ? 'w-28'
                                      : 'w-36'
                            "
                          ></div>
                        </div>
                        <div class="shrink-0 h-3 w-3 rounded bg-white/30"></div>
                      </div>
                    </div>
                  </template>

                  <!-- LOADED -->
                  <template v-else>
                    <template
                      v-for="modulecategory in navigation"
                      :key="modulecategory.id"
                    >
                      <div class="w-full flex flex-col gap-0.5">
                        <!-- CATEGORY HEADER -->
                        <button
                          @click="toggleCategory(modulecategory.id)"
                          class="w-full flex items-center justify-between px-3 py-3 bg-gray-200/15 hover:bg-gray-200/25 rounded-lg transition-colors duration-150"
                        >
                          <div class="flex items-center gap-2.5 min-w-0">
                            <font-awesome-icon
                              v-if="modulecategory.icon"
                              :icon="'fa-solid ' + modulecategory.icon"
                              class="shrink-0 text-white/80 h-4 w-4"
                            />
                            <span
                              class="text-[12px] font-bold uppercase tracking-widest text-white/90 truncate"
                            >
                              {{ modulecategory.name }}
                            </span>
                          </div>
                          <svg
                            class="shrink-0 h-3.5 w-3.5 text-white/70 transition-transform duration-200"
                            :class="
                              openCategoryId === modulecategory.id
                                ? 'rotate-90'
                                : ''
                            "
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M6 6L14 10L6 14V6Z" />
                          </svg>
                        </button>

                        <!-- CATEGORY CONTENT -->
                        <Transition
                          enter-active-class="transition-all duration-150 ease-out"
                          enter-from-class="opacity-0 max-h-0"
                          enter-to-class="opacity-100 max-h-[1000px]"
                          leave-active-class="transition-all duration-100 ease-in"
                          leave-from-class="opacity-100 max-h-[1000px]"
                          leave-to-class="opacity-0 max-h-0"
                        >
                          <div
                            v-show="openCategoryId === modulecategory.id"
                            class="w-full overflow-hidden"
                          >
                            <div class="flex flex-col gap-0.5 pt-0.5 pl-2">
                              <template
                                v-for="item in modulecategory.modules"
                                :key="item.id"
                              >
                                <!-- SIMPLE MODULE -->
                                <RouterLink
                                  v-if="
                                    item.has_children == 0 && !item.parent_id
                                  "
                                  :to="item.url_name"
                                  class="flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 ease-in-out border-l-[3px]"
                                  :class="
                                    isUrlActive(item.url_name)
                                      ? 'bg-gray-200 text-gray-900 font-semibold border-gray-400'
                                      : 'text-white/70 hover:text-white hover:bg-white/5 border-transparent'
                                  "
                                  @click="sidebarOpen = false"
                                >
                                  <font-awesome-icon
                                    :icon="'fa-solid ' + item.icon"
                                    class="shrink-0 w-4 h-4 transition-colors duration-200"
                                    :class="
                                      isUrlActive(item.url_name)
                                        ? 'text-gray-600'
                                        : 'text-white/70'
                                    "
                                  />
                                  <span
                                    class="text-[13px] font-medium tracking-wide truncate"
                                  >
                                    {{ item.name }}
                                  </span>
                                </RouterLink>

                                <!-- PARENT MODULE -->
                                <Disclosure
                                  v-else
                                  as="div"
                                  class="w-full"
                                  v-slot="{ open: childOpen }"
                                  :default-open="
                                    item.children?.some((child) =>
                                      isUrlActive(child.url_name),
                                    )
                                  "
                                >
                                  <DisclosureButton
                                    class="w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-md transition-all duration-200 ease-in-out border-l-[3px]"
                                    :class="
                                      isUrlActive(item.url_name) ||
                                      item.children?.some((c) =>
                                        isUrlActive(c.url_name),
                                      )
                                        ? 'bg-gray-200 text-gray-900 font-semibold border-gray-400'
                                        : 'text-white/70 hover:text-white hover:bg-white/5 border-transparent'
                                    "
                                  >
                                    <div
                                      class="flex items-center gap-3 min-w-0"
                                    >
                                      <font-awesome-icon
                                        :icon="'fa-solid ' + item.icon"
                                        class="w-3.5 shrink-0 transition-colors duration-200"
                                        :class="
                                          isUrlActive(item.url_name) ||
                                          item.children?.some((c) =>
                                            isUrlActive(c.url_name),
                                          )
                                            ? 'text-gray-600'
                                            : 'text-white/70'
                                        "
                                      />
                                      <span
                                        class="text-[12px] font-medium tracking-wide truncate"
                                      >
                                        {{ item.name }}
                                      </span>
                                    </div>
                                    <svg
                                      class="h-3 w-3 transition-all duration-200 shrink-0"
                                      :class="[
                                        childOpen ? 'rotate-90' : '',
                                        isUrlActive(item.url_name) ||
                                        item.children?.some((c) =>
                                          isUrlActive(c.url_name),
                                        )
                                          ? 'text-gray-500'
                                          : 'text-white/50',
                                      ]"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path d="M6 6L14 10L6 14V6Z" />
                                    </svg>
                                  </DisclosureButton>
                                  <DisclosurePanel class="w-full">
                                    <div
                                      class="flex flex-col gap-0.5 pl-4 pt-0.5"
                                    >
                                      <RouterLink
                                        v-for="subItem in item.children"
                                        :key="subItem.id"
                                        :to="subItem.url_name"
                                        class="flex items-center gap-2.5 px-4 py-2 rounded-md transition-all duration-200 ease-in-out border-l-2"
                                        :class="
                                          isUrlActive(subItem.url_name)
                                            ? 'bg-gray-200 text-gray-900 font-semibold border-gray-400'
                                            : 'text-white/50 hover:text-white hover:bg-white/5 border-transparent'
                                        "
                                        @click="sidebarOpen = false"
                                      >
                                        <span
                                          class="w-1 h-1 rounded-full shrink-0 transition-all duration-200"
                                          :class="
                                            isUrlActive(subItem.url_name)
                                              ? 'bg-gray-500 scale-110'
                                              : 'bg-white/40'
                                          "
                                        ></span>
                                        <span
                                          class="text-[11px] font-medium tracking-wide truncate"
                                        >
                                          {{ subItem.name }}
                                        </span>
                                      </RouterLink>
                                    </div>
                                  </DisclosurePanel>
                                </Disclosure>
                              </template>
                            </div>
                          </div>
                        </Transition>
                      </div>
                    </template>
                  </template>
                </nav>

                <!-- FOOTER — match desktop expanded state -->
                <div
                  class="shrink-0 border-t border-black/20 bg-[var(--system-color)] px-4 py-3 mt-auto flex items-center justify-center"
                >
                  <div class="flex flex-col items-center gap-0.5 text-center">
                    <span
                      class="text-[12px] font-bold text-white/70 tracking-wide uppercase truncate"
                    >
                      {{ organizationName }}
                    </span>
                    <span class="text-[12px] text-white/40 leading-none">
                      © {{ new Date().getFullYear() }} All Rights Reserved
                    </span>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>
    <!-- END FOR MOBILE SIDEBAR -->

    <!-- Static sidebar for desktop -->
    <div
      class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col transition-all duration-300 ease-in-out"
      :class="sidebarDesktopOpen ? 'lg:w-72' : 'lg:w-16'"
    >
      <!-- SHELL -->
      <div
        class="flex flex-col h-full bg-[var(--system-color)] border-r border-black/20 overflow-hidden"
      >
        <!-- LOGO -->
        <div
          class="h-16 shrink-0 relative flex items-center justify-center border-b border-black/20 bg-[var(--system-color)] overflow-hidden"
        >
          <!-- EXPANDED STATE: object-contain, full logo -->
          <img
            v-if="imageSrc"
            :src="imageSrc"
            class="absolute h-16 w-auto object-contain scale-105 transition-all duration-300 ease-in-out"
            :class="sidebarDesktopOpen ? 'opacity-100' : 'opacity-0'"
          />

          <!-- COLLAPSED STATE: object-cover object-left, icon crop -->
          <img
            v-if="imageSrc"
            :src="imageSrc"
            class="h-14 w-10 object-cover object-left scale-110 transition-all duration-300 ease-in-out"
            :class="sidebarDesktopOpen ? 'opacity-0' : 'opacity-100'"
          />
        </div>

        <!-- CONTENT WRAPPER -->
        <div class="flex flex-col flex-1 min-h-0 overflow-hidden">
          <!-- SCROLL AREA -->
          <div
            class="flex-1 min-h-0 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <nav class="w-full px-3 py-3 flex flex-col gap-2">
              <!-- SKELETON LOADER -->
              <template v-if="!hasLoaded">
                <div
                  v-for="i in 20"
                  :key="'skel-' + i"
                  class="w-full flex flex-col gap-0.5"
                >
                  <!-- CATEGORY HEADER SKELETON ONLY -->
                  <div
                    class="w-full flex items-center justify-between px-3 py-3 bg-white/15 rounded-lg animate-pulse"
                  >
                    <div class="flex items-center gap-2.5 min-w-0">
                      <!-- Icon placeholder -->
                      <div class="shrink-0 h-4 w-4 rounded bg-white/40"></div>
                      <!-- Label placeholder — varying widths -->
                      <div
                        class="h-2.5 rounded bg-white/30 transition-[opacity,max-width] duration-300 ease-in-out"
                        :class="[
                          sidebarDesktopOpen
                            ? 'opacity-100'
                            : 'opacity-0 max-w-0',
                          i % 5 === 0
                            ? 'w-20'
                            : i % 4 === 0
                              ? 'w-24'
                              : i % 3 === 0
                                ? 'w-32'
                                : i % 2 === 0
                                  ? 'w-28'
                                  : 'w-36',
                        ]"
                      ></div>
                    </div>
                    <!-- Arrow placeholder -->
                    <div
                      class="shrink-0 h-3 w-3 rounded bg-white/30"
                      :class="sidebarDesktopOpen ? 'opacity-100' : 'opacity-0'"
                    ></div>
                  </div>
                </div>
              </template>

              <template v-else>
                <template
                  v-for="modulecategory in navigation"
                  :key="modulecategory.id"
                >
                  <!-- CATEGORY WRAPPER -->
                  <div class="w-full flex flex-col gap-0.5">
                    <!-- CATEGORY HEADER -->
                    <button
                      @click="
                        sidebarDesktopOpen
                          ? toggleCategory(modulecategory.id)
                          : openSidebarToCategory(modulecategory.id)
                      "
                      :title="
                        !sidebarDesktopOpen ? modulecategory.name : undefined
                      "
                      class="w-full flex items-center justify-between px-3 py-3 bg-gray-200/15 hover:bg-gray-200/25 rounded-lg transition-colors duration-150"
                    >
                      <div class="flex items-center gap-2.5 min-w-0">
                        <font-awesome-icon
                          v-if="modulecategory.icon"
                          :icon="'fa-solid ' + modulecategory.icon"
                          class="shrink-0 text-white/80 h-4 w-4 transition-all duration-300"
                        />
                        <span
                          class="text-[12px] font-bold uppercase tracking-widest text-white/90 truncate transition-[opacity,max-width] duration-300 ease-in-out overflow-hidden whitespace-nowrap"
                          :class="
                            sidebarDesktopOpen
                              ? 'opacity-100 max-w-xs'
                              : 'opacity-0 max-w-0'
                          "
                        >
                          {{ modulecategory.name }}
                        </span>
                      </div>
                      <svg
                        class="shrink-0 h-3.5 w-3.5 text-white/70 transition-all duration-300"
                        :class="[
                          openCategoryId === modulecategory.id
                            ? 'rotate-90'
                            : '',
                          sidebarDesktopOpen ? 'opacity-100' : 'opacity-0 w-0',
                        ]"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M6 6L14 10L6 14V6Z" />
                      </svg>
                    </button>

                    <!-- CATEGORY CONTENT -->
                    <Transition
                      enter-active-class="transition-all duration-150 ease-out"
                      enter-from-class="opacity-0 max-h-0"
                      enter-to-class="opacity-100 max-h-[1000px]"
                      leave-active-class="transition-all duration-100 ease-in"
                      leave-from-class="opacity-100 max-h-[1000px]"
                      leave-to-class="opacity-0 max-h-0"
                    >
                      <div
                        v-show="
                          sidebarDesktopOpen &&
                          openCategoryId === modulecategory.id
                        "
                        class="w-full overflow-hidden"
                      >
                        <div
                          class="flex flex-col gap-0.5 pt-0.5"
                          :class="sidebarDesktopOpen ? 'pl-2' : 'pl-0'"
                        >
                          <template
                            v-for="item in modulecategory.modules"
                            :key="item.id"
                          >
                            <!-- SIMPLE MODULE -->
                            <RouterLink
                              v-if="item.has_children == 0 && !item.parent_id"
                              :to="item.url_name"
                              :title="
                                !sidebarDesktopOpen ? item.name : undefined
                              "
                              class="flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 ease-in-out border-l-[3px]"
                              :class="
                                isUrlActive(item.url_name)
                                  ? 'bg-gray-200 text-gray-900 font-semibold border-gray-400'
                                  : 'text-white/70 hover:text-white hover:bg-white/5 border-transparent'
                              "
                            >
                              <font-awesome-icon
                                :icon="'fa-solid ' + item.icon"
                                class="shrink-0 w-4 h-4 transition-colors duration-200"
                                :class="
                                  isUrlActive(item.url_name)
                                    ? 'text-gray-600'
                                    : 'text-white/70'
                                "
                              />
                              <span
                                class="text-[13px] font-medium tracking-wide truncate transition-[opacity,max-width] duration-300 ease-in-out overflow-hidden whitespace-nowrap"
                                :class="
                                  sidebarDesktopOpen
                                    ? 'opacity-100 max-w-[180px]'
                                    : 'opacity-0 max-w-0'
                                "
                              >
                                {{ item.name }}
                              </span>
                            </RouterLink>

                            <!-- PARENT MODULE -->
                            <template v-else>
                              <!-- COLLAPSED: flat icon for parent + each child -->
                              <template v-if="!sidebarDesktopOpen">
                                <RouterLink
                                  :to="item.url_name"
                                  :title="item.name"
                                  class="flex justify-center items-center px-2 py-2.5 rounded-md transition-all duration-200 border-l-[3px]"
                                  @click="
                                    handleCollapsedIconClick(
                                      item,
                                      modulecategory.id,
                                      $event,
                                    )
                                  "
                                  :class="
                                    isUrlActive(item.url_name) ||
                                    item.children?.some((c) =>
                                      isUrlActive(c.url_name),
                                    )
                                      ? 'bg-gray-200 text-gray-600 border-gray-400'
                                      : 'text-white/70 hover:text-white hover:bg-white/5 border-transparent'
                                  "
                                >
                                  <font-awesome-icon
                                    :icon="'fa-solid ' + item.icon"
                                    class="w-4 h-4 shrink-0"
                                  />
                                </RouterLink>
                                <RouterLink
                                  v-for="subItem in item.children"
                                  :key="subItem.id"
                                  :to="subItem.url_name"
                                  :title="subItem.name"
                                  class="flex justify-center items-center px-2 py-2 rounded-md transition-all duration-200 border-l-[3px]"
                                  @click="
                                    handleCollapsedIconClick(
                                      item,
                                      modulecategory.id,
                                      $event,
                                    )
                                  "
                                  :class="
                                    isUrlActive(subItem.url_name)
                                      ? 'bg-gray-200 text-gray-600 border-gray-400'
                                      : 'text-white/40 hover:text-white hover:bg-white/5 border-transparent'
                                  "
                                >
                                  <font-awesome-icon
                                    v-if="subItem.icon"
                                    :icon="'fa-solid ' + subItem.icon"
                                    class="w-3.5 h-3.5 shrink-0"
                                  />
                                  <span
                                    v-else
                                    class="w-1 h-1 rounded-full bg-current"
                                  ></span>
                                </RouterLink>
                              </template>

                              <!-- EXPANDED: normal Disclosure -->
                              <Disclosure
                                v-else
                                as="div"
                                class="w-full"
                                v-slot="{ open: childOpen }"
                              >
                                <DisclosureButton
                                  class="w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-md transition-all duration-200 ease-in-out"
                                  :class="
                                    isUrlActive(item.url_name) ||
                                    item.children?.some((c) =>
                                      isUrlActive(c.url_name),
                                    )
                                      ? 'bg-gray-200 text-gray-900 font-semibold border-l-[3px] border-gray-400'
                                      : 'text-white/70 hover:text-white hover:bg-white/5 border-l-[3px] border-transparent'
                                  "
                                >
                                  <div class="flex items-center gap-3 min-w-0">
                                    <font-awesome-icon
                                      :icon="'fa-solid ' + item.icon"
                                      class="w-3.5 shrink-0 transition-colors duration-200"
                                      :class="
                                        isUrlActive(item.url_name) ||
                                        item.children?.some((c) =>
                                          isUrlActive(c.url_name),
                                        )
                                          ? 'text-gray-600'
                                          : 'text-white/70'
                                      "
                                    />
                                    <span
                                      class="text-[12px] font-medium tracking-wide truncate transition-colors duration-200"
                                    >
                                      {{ item.name }}
                                    </span>
                                  </div>
                                  <svg
                                    class="h-3 w-3 transition-all duration-200 shrink-0"
                                    :class="[
                                      childOpen ? 'rotate-90' : '',
                                      isUrlActive(item.url_name) ||
                                      item.children?.some((c) =>
                                        isUrlActive(c.url_name),
                                      )
                                        ? 'text-gray-500'
                                        : 'text-white/50',
                                    ]"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path d="M6 6L14 10L6 14V6Z" />
                                  </svg>
                                </DisclosureButton>
                                <DisclosurePanel class="w-full">
                                  <div
                                    class="flex flex-col gap-0.5 pl-4 pt-0.5"
                                  >
                                    <RouterLink
                                      v-for="subItem in item.children"
                                      :key="subItem.id"
                                      :to="subItem.url_name"
                                      class="flex items-center gap-2.5 px-4 py-2 rounded-md transition-all duration-200 ease-in-out"
                                      :class="
                                        isUrlActive(subItem.url_name)
                                          ? 'bg-gray-200 text-gray-900 font-semibold border-l-2 border-gray-400'
                                          : 'text-white/50 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
                                      "
                                    >
                                      <span
                                        class="w-1 h-1 rounded-full shrink-0 transition-all duration-200"
                                        :class="
                                          isUrlActive(subItem.url_name)
                                            ? 'bg-gray-500 scale-110'
                                            : 'bg-white/40'
                                        "
                                      ></span>
                                      <span
                                        class="text-[11px] font-medium tracking-wide truncate transition-colors duration-200"
                                      >
                                        {{ subItem.name }}
                                      </span>
                                    </RouterLink>
                                  </div>
                                </DisclosurePanel>
                              </Disclosure>
                            </template>
                          </template>
                        </div>
                      </div>
                    </Transition>
                  </div>
                </template>
              </template>
            </nav>
          </div>

          <!-- FOOTER -->
          <div
            class="shrink-0 border-t border-black/20 bg-[var(--system-color)] transition-all duration-300 flex items-center justify-center"
            :class="sidebarDesktopOpen ? 'px-4 py-3' : 'px-2 py-3'"
          >
            <template v-if="sidebarDesktopOpen">
              <div class="flex flex-col items-center gap-0.5 text-center">
                <span
                  class="text-[12px] font-bold text-white/70 tracking-wide uppercase truncate"
                >
                  {{ organizationName }}
                </span>
                <span class="text-[12px] text-white/40 leading-none">
                  © {{ new Date().getFullYear() }} All Rights Reserved
                </span>
              </div>
            </template>
            <font-awesome-icon
              v-else
              icon="fa-solid fa-hospital"
              class="h-4 w-4 text-white/40"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- END Static sidebar for desktop -->

    <!-- APP SHELL -->
    <div
      :class="[
        'min-h-screen bg-gray-200 transition-all duration-300',
        sidebarDesktopOpen ? 'lg:pl-72' : 'lg:pl-16',
      ]"
    >
      <!-- HEADER -->
      <header
        ref="headerRef"
        class="sticky top-0 z-40 h-16 flex items-center justify-between bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 gap-4"
      >
        <!-- LEFT SECTION -->
        <div class="flex items-center gap-2.5 min-w-0">
          <!-- Mobile sidebar toggle -->
          <button
            class="lg:hidden p-2 rounded-md hover:bg-[var(--system-color-soft)] transition-colors group"
            @click="sidebarOpen = true"
          >
            <Bars3Icon
              class="h-6 w-6 text-gray-500 group-hover:text-[var(--system-color)] transition-colors"
            />
          </button>

          <!-- Desktop sidebar toggle -->
          <button
            class="hidden lg:flex p-2 rounded-md bg-[var(--system-color)] hover:bg-[var(--system-color-hover)] transition-colors"
            @click="toggleDesktopSidebar"
          >
            <svg
              v-if="sidebarDesktopOpen"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="text-white"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M15 3v18" />
              <path d="m10 15-3-3 3-3" />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="text-white"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M15 3v18" />
              <path d="m8 9 3 3-3 3" />
            </svg>
          </button>

          <div class="h-5 w-px bg-gray-200" />

          <!-- SYSTEM INFO -->
          <div class="flex items-center gap-3 min-w-0">
            <img
              v-if="companyLogoSrc"
              :src="companyLogoSrc"
              :alt="companyLogoAlt"
              class="w-9 h-9 object-contain shrink-0"
            />
            <div class="flex flex-col min-w-0 leading-tight">
              <span
                class="text-[13px] font-bold text-gray-800 truncate tracking-wide"
              >
                {{ systemName }}
              </span>
              <span
                class="text-[10px] font-medium text-gray-400 uppercase tracking-widest truncate"
              >
                {{ appTitle }}
              </span>
            </div>
          </div>
        </div>

        <!-- RIGHT SECTION -->
        <div class="flex items-center gap-2 shrink-0">
          <!-- Notifications -->
          <button
            class="relative p-2 rounded-md hover:bg-[var(--system-color-soft)] transition-colors group"
            type="button"
            aria-label="Notifications"
            @click="emit('notification-click')"
          >
            <BellIcon
              class="h-6 w-6 text-gray-500 group-hover:text-[var(--system-color)] transition-colors"
            />
            <span
              v-if="notificationCount > 0"
              class="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-1 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white leading-none"
            >
              {{ notificationCount > 99 ? "99+" : notificationCount }}
            </span>
          </button>

          <!-- HELP -->
          <Menu as="div" class="relative">
            <MenuButton
              class="p-2 rounded-md hover:bg-[var(--system-color-soft)] transition-colors group"
              title="Need help?"
            >
              <QuestionMarkCircleIcon
                class="h-6 w-6 text-gray-500 group-hover:text-[var(--system-color)] transition-colors"
              />
            </MenuButton>
            <transition
              enter-active-class="transition ease-out duration-150"
              enter-from-class="opacity-0 scale-95 translate-y-1"
              enter-to-class="opacity-100 scale-100 translate-y-0"
              leave-active-class="transition ease-in duration-100"
              leave-from-class="opacity-100 scale-100"
              leave-to-class="opacity-0 scale-95 translate-y-1"
            >
              <MenuItems
                class="absolute right-0 mt-2 w-56 z-50 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black/8 overflow-hidden"
              >
                <div class="px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <p class="text-[13px] font-semibold text-gray-800">
                    Need help?
                  </p>
                  <p class="text-[11px] text-gray-400">Resources & support</p>
                </div>
                <div class="py-1">
                  <MenuItem v-slot="{ active }">
                    <a
                      :href="documentationHref"
                      target="_blank"
                      class="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                      :class="
                        active
                          ? 'bg-[var(--system-color-soft)] text-[var(--system-color)]'
                          : 'text-gray-700'
                      "
                    >
                      <BookOpenIcon class="h-4 w-4 shrink-0" />
                      <div>
                        <p class="font-medium leading-none">Documentation</p>
                        <p class="text-[11px] text-gray-400 mt-0.5">
                          Guides & references
                        </p>
                      </div>
                    </a>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <a
                      :href="`mailto:${supportEmail}`"
                      class="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                      :class="
                        active
                          ? 'bg-[var(--system-color-soft)] text-[var(--system-color)]'
                          : 'text-gray-700'
                      "
                    >
                      <EnvelopeIcon class="h-4 w-4 shrink-0" />
                      <div>
                        <p class="font-medium leading-none">Contact us</p>
                        <p class="text-[11px] text-gray-400 mt-0.5">
                          {{ supportEmail }}
                        </p>
                      </div>
                    </a>
                  </MenuItem>
                </div>
              </MenuItems>
            </transition>
          </Menu>

          <!-- SYSTEM SWITCHER -->
          <Menu as="div" class="relative">
            <MenuButton
              class="p-2 rounded-md hover:bg-[var(--system-color-soft)] transition-colors group"
              title="Switch System"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="text-gray-500 group-hover:text-[var(--system-color)] transition-colors"
              >
                <circle cx="12" cy="5" r="1" />
                <circle cx="19" cy="5" r="1" />
                <circle cx="5" cy="5" r="1" />
                <circle cx="12" cy="12" r="1" />
                <circle cx="19" cy="12" r="1" />
                <circle cx="5" cy="12" r="1" />
                <circle cx="12" cy="19" r="1" />
                <circle cx="19" cy="19" r="1" />
                <circle cx="5" cy="19" r="1" />
              </svg>
            </MenuButton>
            <transition
              enter-active-class="transition ease-out duration-150"
              enter-from-class="opacity-0 scale-95 translate-y-1"
              enter-to-class="opacity-100 scale-100 translate-y-0"
              leave-active-class="transition ease-in duration-100"
              leave-from-class="opacity-100 scale-100"
              leave-to-class="opacity-0 scale-95 translate-y-1"
            >
              <MenuItems
                class="absolute right-0 mt-2 w-56 z-50 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black/8 overflow-hidden p-3"
              >
                <p
                  class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2.5 px-1"
                >
                  Switch System
                </p>
                <div class="grid grid-cols-3 gap-1">
                  <MenuItem
                    v-for="item in systems"
                    :key="item.id"
                    v-slot="{ active }"
                  >
                    <a
                      :href="item.href"
                      @click="emit('system-select', item)"
                      class="flex flex-col items-center justify-center gap-1 p-2 rounded-lg border transition-colors"
                      :class="
                        activeDomain === item.href
                          ? 'bg-[var(--system-color)] text-white border-[var(--system-color)]'
                          : active
                            ? 'bg-[var(--system-color-soft)] text-[var(--system-color)] border-[var(--system-color-border)]'
                            : 'text-gray-400 border-gray-100 hover:bg-[var(--system-color-soft)] hover:text-[var(--system-color)] hover:border-[var(--system-color-border)]'
                      "
                    >
                      <font-awesome-icon :icon="item.icon" class="h-4 w-4" />
                      <span
                        class="text-[9px] font-semibold tracking-wide truncate w-full text-center leading-none"
                      >
                        {{ item.short_name }}
                      </span>
                    </a>
                  </MenuItem>
                </div>
              </MenuItems>
            </transition>
          </Menu>

          <!-- DIVIDER -->
          <div class="h-6 w-px bg-gray-200 mx-1" />

          <!-- PROFILE -->
          <Menu as="div" class="relative">
            <MenuButton
              class="p-2 rounded-md bg-[var(--system-color)] hover:bg-[var(--system-color-hover)] transition-colors"
            >
              <span
                class="flex items-center justify-center h-6 w-6 text-sm font-bold text-white"
              >
                {{ userInitials }}
              </span>
            </MenuButton>
            <transition
              enter-active-class="transition ease-out duration-150"
              enter-from-class="opacity-0 scale-95 translate-y-1"
              enter-to-class="opacity-100 scale-100 translate-y-0"
              leave-active-class="transition ease-in duration-100"
              leave-from-class="opacity-100 scale-100"
              leave-to-class="opacity-0 scale-95 translate-y-1"
            >
              <MenuItems
                class="absolute right-0 mt-2 w-52 z-50 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black/8 overflow-hidden"
              >
                <div class="px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <p class="text-[13px] font-semibold text-gray-800 truncate">
                    {{ user?.name }}
                  </p>
                  <p class="text-[11px] text-gray-400 truncate">
                    {{ user?.email }}
                  </p>
                </div>
                <div class="py-1">
                  <MenuItem
                    v-for="item in userNavigation"
                    :key="item.name"
                    v-slot="{ active }"
                  >
                    <button
                      @click="item.action"
                      class="w-full text-left px-4 py-2.5 text-sm transition-colors"
                      :class="
                        item.name === 'Sign out'
                          ? active
                            ? 'bg-red-50 text-red-600'
                            : 'text-red-500 hover:bg-red-50'
                          : active
                            ? 'bg-[var(--system-color-soft)] text-[var(--system-color)]'
                            : 'text-gray-700 hover:bg-gray-50'
                      "
                    >
                      {{ item.name }}
                    </button>
                  </MenuItem>
                </div>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </header>

      <!-- MAIN -->
      <main
        ref="mainContentRef"
        class="h-[calc(100vh-4rem)] overflow-auto bg-gray-200"
        @scroll="handleMainScroll"
      >
        <div class="p-4 min-h-full">
          <!-- CONTAINER -->
          <div
            class="bg-white rounded-2xl overflow-clip border border-gray-200 shadow-sm min-h-[calc(100vh-6rem)] flex flex-col"
          >
            <!-- PAGE HEADER SLOT -->
            <div
              class="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-100 w-full"
            >
              <div v-if="$slots.filters" class="w-full px-6 pb-4">
                <slot name="filters" />
              </div>
            </div>

            <!-- CONTENT -->
            <div class="flex-1">
              <div class="mx-auto w-full">
                <slot>
                  <RouterView />
                </slot>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import {
  Bars3Icon,
  BellIcon,
  BookOpenIcon,
  EnvelopeIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { getInitials } from "../../utils/text.js";

const props = defineProps({
  navigation: { type: Array, default: () => [] },
  systems: { type: Array, default: () => [] },
  user: { type: Object, default: () => ({}) },
  currentPath: { type: String, default: "" },
  activeDomain: { type: String, default: "" },
  appTitle: { type: String, default: "" },
  systemName: { type: String, default: "SMARTMED" },
  organizationName: { type: String, default: "SMARTMED" },
  logoSrc: { type: String, default: "" },
  companyLogoSrc: { type: String, default: "" },
  companyLogoAlt: { type: String, default: "System logo" },
  notificationCount: { type: Number, default: 0 },
  loaded: { type: Boolean, default: true },
  documentationHref: { type: String, default: "/docs" },
  supportEmail: { type: String, default: "support@smartmed.local" },
  sidebarStorageKey: {
    type: String,
    default: "smartmed:master-layout:sidebar-expanded",
  },
  initialSidebarExpanded: { type: Boolean, default: true },
});

const emit = defineEmits([
  "logout",
  "navigate-main",
  "notification-click",
  "system-select",
  "sidebar-change",
  "content-scroll",
]);

const sidebarOpen = ref(false);
const sidebarDesktopOpen = ref(props.initialSidebarExpanded);
const openCategoryId = ref(null);
const mainContentRef = ref(null);
const headerRef = ref(null);

const imageSrc = computed(() => props.logoSrc);
const companyLogoSrc = computed(() => props.companyLogoSrc);
const navigation = computed(() => props.navigation);
const systems = computed(() => props.systems);
const user = computed(() => props.user);
const appTitle = computed(() => props.appTitle);
const systemName = computed(() => props.systemName);
const organizationName = computed(() => props.organizationName);
const companyLogoAlt = computed(() => props.companyLogoAlt);
const notificationCount = computed(() => props.notificationCount);
const activeDomain = computed(() => props.activeDomain);
const documentationHref = computed(() => props.documentationHref);
const supportEmail = computed(() => props.supportEmail);
const hasLoaded = computed(() => props.loaded);
const userInitials = computed(() => getInitials(props.user?.name));

const isUrlActive = (url) =>
  Boolean(url) && Boolean(props.currentPath) && props.currentPath.includes(url);

const findActiveCategoryId = () => {
  for (const category of props.navigation) {
    const hasActiveModule = category.modules?.some(
      (module) =>
        isUrlActive(module.url_name) ||
        module.children?.some((child) => isUrlActive(child.url_name)),
    );

    if (hasActiveModule) return category.id;
  }

  return null;
};

const toggleCategory = (id) => {
  openCategoryId.value = openCategoryId.value === id ? null : id;
};

const openSidebarToCategory = (categoryId) => {
  sidebarDesktopOpen.value = true;
  openCategoryId.value = categoryId;
  persistSidebarState();
};

const persistSidebarState = () => {
  if (!props.sidebarStorageKey || typeof localStorage === "undefined") return;

  try {
    localStorage.setItem(
      props.sidebarStorageKey,
      String(sidebarDesktopOpen.value),
    );
  } catch {
    // Sidebar persistence is optional when browser storage is unavailable.
  }
};

const toggleDesktopSidebar = () => {
  sidebarDesktopOpen.value = !sidebarDesktopOpen.value;
  persistSidebarState();
  emit("sidebar-change", sidebarDesktopOpen.value);
};

const handleCollapsedIconClick = (_item, categoryId) => {
  openSidebarToCategory(categoryId);
  emit("sidebar-change", true);
};

const handleMainScroll = (event) => {
  emit("content-scroll", event);
};

const userNavigation = computed(() => [
  { id: "main", name: "Main Page", action: () => emit("navigate-main") },
  { id: "logout", name: "Sign out", action: () => emit("logout") },
]);

onMounted(() => {
  if (props.sidebarStorageKey && typeof localStorage !== "undefined") {
    try {
      const savedState = localStorage.getItem(props.sidebarStorageKey);
      if (savedState !== null) {
        sidebarDesktopOpen.value = savedState === "true";
      }
    } catch {
      // Use the supplied initial state when browser storage is unavailable.
    }
  }

  openCategoryId.value = findActiveCategoryId();
});

watch(
  () => props.currentPath,
  () => {
    sidebarOpen.value = false;
    openCategoryId.value = findActiveCategoryId();
  },
);

watch(
  () => props.navigation,
  () => {
    openCategoryId.value = findActiveCategoryId();
  },
  { deep: true },
);
</script>
