import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Footer } from "@/views/section";
import Api from "@/api";

interface MetaData {
  first_name?: string;
  about_description?: string;
  about_image?: string;
  about_image_alt?: string;
  instagram_url?: string;
  author_name?: string;
  facebook_url?: string;
  whatsapp_url?: string;
  discord_url?: string;
  email?: string;
  phone_number?: string;
  whatsapp_number?: string;
  address?: string;
  meta_description?: string;
  logo_path?: string;
}

interface MenuItem {
  id: number;
  name: string;
  title: string;
  url: string;
}

function Root() {

  const [meta, setMeta] = useState<MetaData | null>(null);
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const today = new Date();
  const year = today.getFullYear();

  useEffect(() => {
    let isActive = true;

    const fetchDataIndex = async () => {
      const [metaRes, menusRes] = await Promise.all([
        Api.get("/web-setting"),
        Api.get("/menus")
      ]);

      if (!isActive) {
        return;
      }

      if (metaRes.data?.data) setMeta(metaRes.data.data);
      if (menusRes?.data?.data) setMenus(menusRes.data.data);
    };

    void fetchDataIndex();

    return () => {
      isActive = false;
    };
  }, []);


  return (
    <>
    <Outlet />
    
    {meta && <Footer site_name={meta?.first_name || "Tarkam"} copyRight="© " Year={year} instagram_url={meta.instagram_url || "#"} author_name={meta?.author_name} facebook_url={meta?.facebook_url || "#"} whatsapp_url={meta?.whatsapp_url || "#"} discord_url={meta?.discord_url || "#"} email={meta?.email} phone_number={meta?.phone_number} whatsapp_number={meta?.whatsapp_number} address={meta?.address} meta_description={meta?.meta_description} logoPath={meta?.logo_path || "/src/assets/images/logo.png"} menus={menus} />}
    </>
  )
}

export default Root;
